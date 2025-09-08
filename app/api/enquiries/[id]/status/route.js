import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Enquiry from "@/models/enquiry";
import { verifyToken } from "@/lib/jwt";

const VALID_STATUSES = ["pending", "contacted", "replied", "resolved", "archived", "cancelled", "rejected", "approved"];

export async function PATCH(request, { params }) {
  try {
    // Get the enquiry ID from the URL params - await it first
    const { id: enquiryId } = await params;
    if (!enquiryId) {
      return NextResponse.json(
        { error: "Enquiry ID is required" },
        { status: 400 }
      );
    }

    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded || (!decoded.userId && !decoded.id)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId || decoded.id;

    await connectDB();

    // Get the new status from request body
    const body = await request.json();
    const status = body?.status?.toLowerCase();

    // Validate status
    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Find the enquiry and verify ownership
    const enquiry = await Enquiry.findById(enquiryId).populate(
      "property",
      "owner"
    );

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    // Verify that the user is the recipient of the enquiry
    if (enquiry.recipient.toString() !== userId) {
      return NextResponse.json(
        { error: "Not authorized to update this enquiry" },
        { status: 403 }
      );
    }

    // Update the enquiry status
    enquiry.status = status;
    try {
      await enquiry.save();
    } catch (saveError) {
      console.error("Error saving enquiry:", saveError);
      return NextResponse.json(
        { error: "Failed to update enquiry status" },
        { status: 500 }
      );
    }

    // Return the updated enquiry with populated fields
    const updatedEnquiry = await Enquiry.findById(enquiryId)
      .populate("sender", "name email phone")
      .populate("recipient", "name email phone")
      .populate("property", "title images");

    return NextResponse.json(updatedEnquiry);
  } catch (error) {
    console.error("Error updating enquiry status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update enquiry status" },
      { status: 500 }
    );
  }
}
