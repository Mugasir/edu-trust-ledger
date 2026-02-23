import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Create admin user
    const adminEmail = "admin@edutrack.ug";
    const adminPassword = "Admin@2026";

    // Check if admin already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const adminExists = existingUsers?.users?.find((u: any) => u.email === adminEmail);

    let adminUserId: string;
    if (adminExists) {
      adminUserId = adminExists.id;
    } else {
      const { data: newAdmin, error: adminErr } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { full_name: "EduTrack Admin", role: "admin" },
      });
      if (adminErr) throw adminErr;
      adminUserId = newAdmin.user.id;
    }

    // 2. Create sample institutions with users
    const sampleSchools = [
      { name: "Mengo Senior School", moes: "S.541/001", district: "Kampala", level: "secondary", email: "mengo@school.ug" },
      { name: "Budo Junior School", moes: "P.102/003", district: "Wakiso", level: "primary", email: "budo@school.ug" },
      { name: "Makerere College School", moes: "S.220/005", district: "Kampala", level: "secondary", email: "mcs@school.ug" },
    ];

    const institutionIds: { id: string; name: string }[] = [];

    for (const school of sampleSchools) {
      // Check if institution user exists
      const schoolUserExists = existingUsers?.users?.find((u: any) => u.email === school.email);
      let schoolUserId: string;

      if (schoolUserExists) {
        schoolUserId = schoolUserExists.id;
      } else {
        const { data: newUser, error: userErr } = await supabase.auth.admin.createUser({
          email: school.email,
          password: "School@2026",
          email_confirm: true,
          user_metadata: { full_name: `${school.name} Admin`, role: "institution" },
        });
        if (userErr) throw userErr;
        schoolUserId = newUser.user.id;
      }

      // Check if institution record exists
      const { data: existingInst } = await supabase
        .from("institutions")
        .select("id")
        .eq("user_id", schoolUserId)
        .maybeSingle();

      if (existingInst) {
        institutionIds.push({ id: existingInst.id, name: school.name });
      } else {
        const { data: newInst, error: instErr } = await supabase
          .from("institutions")
          .insert({
            user_id: schoolUserId,
            name: school.name,
            moes_reg_number: school.moes,
            district: school.district,
            level: school.level,
          })
          .select("id")
          .single();
        if (instErr) throw instErr;
        institutionIds.push({ id: newInst.id, name: school.name });
      }
    }

    // 3. Seed learner data for each institution
    const firstNames = ["James", "Sarah", "Moses", "Grace", "Peter", "Amina", "David", "Fatuma", "Joseph", "Alice",
      "Emmanuel", "Esther", "Brian", "Naomi", "Isaac", "Rehema", "Samuel", "Aisha", "Daniel", "Mercy"];
    const lastNames = ["Mukasa", "Nakato", "Ssempa", "Nalwanga", "Kato", "Nambi", "Okello", "Apio", "Ochieng", "Akello",
      "Mugisha", "Tumusiime", "Byaruhanga", "Karungi", "Ainembabazi", "Atuhaire", "Niwagaba", "Kwizera", "Mugabi", "Natukunda"];
    const levels = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "S1", "S2", "S3", "S4", "S5", "S6"];
    const statuses = ["Active", "Active", "Active", "Active", "Completed"];
    const genders = ["Male", "Female"];
    const years = [2023, 2024, 2025, 2026];

    let seqCounter = 1;

    for (const inst of institutionIds) {
      // Get the user_id for this institution
      const { data: instData } = await supabase
        .from("institutions")
        .select("user_id")
        .eq("id", inst.id)
        .single();

      if (!instData) continue;

      // Check existing learners
      const { data: existingLearners } = await supabase
        .from("learners")
        .select("id")
        .eq("institution_id", inst.id);

      if (existingLearners && existingLearners.length > 0) continue; // Already seeded

      const learnersToInsert = [];
      const numLearners = 8 + Math.floor(Math.random() * 8); // 8-15 per school

      for (let j = 0; j < numLearners; j++) {
        const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
        const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
        const year = years[Math.floor(Math.random() * years.length)];
        const level = inst.name.includes("Junior") || inst.name.includes("Budo")
          ? levels.slice(0, 7)[Math.floor(Math.random() * 7)]
          : levels.slice(7)[Math.floor(Math.random() * 6)];
        const edutrackId = `EDU-UG-${year}-${String(seqCounter++).padStart(5, "0")}`;

        learnersToInsert.push({
          institution_id: inst.id,
          user_id: instData.user_id,
          edutrack_id: edutrackId,
          first_name: fn,
          last_name: ln,
          date_of_birth: `${2000 + Math.floor(Math.random() * 12)}-${String(1 + Math.floor(Math.random() * 12)).padStart(2, "0")}-${String(1 + Math.floor(Math.random() * 28)).padStart(2, "0")}`,
          gender: genders[Math.floor(Math.random() * 2)],
          level,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          guardian_name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${ln}`,
          guardian_contact: `+256${700000000 + Math.floor(Math.random() * 99999999)}`,
          uploaded_by: `${inst.name} Admin`,
          last_modified_by: `${inst.name} Admin`,
        });
      }

      const { error: learnersErr } = await supabase.from("learners").insert(learnersToInsert);
      if (learnersErr) console.error("Learner insert error:", learnersErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        admin: { email: adminEmail, password: adminPassword },
        institutions: institutionIds.length,
        message: "Admin account created, sample schools and learners seeded.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
