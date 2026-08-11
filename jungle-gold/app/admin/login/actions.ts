"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Simple in-memory rate limiting map for brute-force protection
const attemptTracker = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes

export async function login(formData: FormData) {
  const password = formData.get("password") as string;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminPass) {
    return { error: "Server misconfiguration: ADMIN_PASSWORD environment variable is not set." };
  }

  // Basic rate limiting track
  const trackerKey = "admin_login_ip";
  const now = Date.now();
  const current = attemptTracker.get(trackerKey) || { count: 0, lastAttempt: now };

  // Reset if cooldown has passed
  if (now - current.lastAttempt > COOLDOWN_MS) {
    current.count = 0;
  }

  if (current.count >= MAX_ATTEMPTS) {
    const minutesLeft = Math.ceil((COOLDOWN_MS - (now - current.lastAttempt)) / 60000);
    return { error: `Too many failed login attempts. Please try again in ${minutesLeft} minutes.` };
  }

  if (password === adminPass) {
    // Reset tracker on success
    attemptTracker.delete(trackerKey);

    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    redirect("/admin");
  } else {
    // Increment failed attempts and introduce artificial delay
    current.count += 1;
    current.lastAttempt = now;
    attemptTracker.set(trackerKey, current);

    // Artificial 600ms delay to thwart brute-force scripts
    await new Promise((resolve) => setTimeout(resolve, 600));

    const remaining = MAX_ATTEMPTS - current.count;
    return { error: `Invalid password. ${remaining} attempt(s) remaining before lockout.` };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
