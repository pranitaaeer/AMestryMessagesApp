import dbConnect from "@/app/lib/DbConnect";
import UserModel from "@/app/models/User.model";
import { getServerSession, User } from "next-auth";

// Type for route params
type RouteParams = { params: { messageid: string } };

export async function DELETE(request: Request, { params }: RouteParams) {
  await dbConnect();
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return Response.json({ success: false, message: "Unauthenticated user" }, { status: 401 });
    }
    const user:User= session.user as User;
    const userId = user._id;
    const messageId = params.messageid;

    const updatedUser = await UserModel.updateOne(
      { _id: userId },
      { $pull: { messages: { _id: messageId } } }
    );

    if (!updatedUser.modifiedCount) {
      return Response.json({ success: false, message: "Error in deleting message" }, { status: 403 });
    }
    return Response.json({ success: true, message: "Delete message successfully" }, { status: 200 });

  } catch (error) {
    console.error("error in deleting message", error);
    return Response.json({ success: false, message: "Error in deleting message" }, { status: 500 });
  }
}