import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export const checkUser = async () => {
  const user = await currentUser();
  console.log(user);

  // check if user is already logged in clerk user
  if (!user) {
    return null;
  }

  // check if user is already in the database
  const loggedInUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
  });

  // if user is in the database, return the user
  if (loggedInUser) {
    return loggedInUser;
  }

  // if user is not in the database, create a new user
  const newUser = await db.user.create({
    data: {
      clerkUserId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      imageURL: user.imageUrl,
    },
  });
  return newUser;
};
