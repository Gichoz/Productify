import type { Request, Response } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import * as queries from "../db/queries.js";

export const syncUser = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // Fetch verified identity data directly from Clerk server-side
    const clerkUser = await clerkClient.users.getUser(userId);

    const email =
      clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return res.status(400).json({ error: "No primary email found for Clerk user" });
    }

    const name =
      `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
      clerkUser.username ||
      "User";
    const imageUrl = clerkUser.imageUrl;

    // Perform upsert using server-verified provider data
    const user = await queries.upsertUser({
      id: userId,
      email,
      name,
      imageUrl,
    });

    
    res.status(200).json(user);
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Failed to sync user" });
  }
};