// import passport from "passport";
// import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
// import { UserRepository } from "../repositories/user.repository";
// import { JWTService } from "../../../shared/services/jwt.service";
// import { IUser } from "../../../shared/models/user.model";

// const userRepository = new UserRepository();

// // Define the structure of the user object passed to `done`
// interface DoneCallback {
//   (
//     error: Error | null,
//     user?: { user: IUser; accessToken: string; refreshToken: string } | null
//   ): void;
// }

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//       callbackURL: "http://localhost:5173/auth/google/callback",
//       passReqToCallback: false,
//     },
//     async (
//       googleAccessToken: string, // Renamed to avoid shadowing
//       googleRefreshToken: string, // Renamed to avoid shadowing
//       profile: Profile,
//       done: DoneCallback
//     ) => {
//       try {
//         // Ensure the profile has an email
//         const email =
//           profile.emails && profile.emails[0] ? profile.emails[0].value : null;
//         if (!email) {
//           return done(new Error("No email found in Google profile"), null);
//         }

//         // Check if the user already exists
//         let user = await userRepository.findByEmail(email);

//         if (!user) {
//           // Create a new user if they don't exist
//           user = await userRepository.createUser({
//             name: profile.displayName,
//             email: email,
//             password: "", // No password for OAuth users
//             googleId: profile.id,
//           });
//         }

//         // Generate JWT tokens
//         const accessToken = JWTService.generateAccessToken("user", {
//           id: user._id.toString(),
//           email: user.email,
//           role: "user",
//         });

//         const refreshToken = JWTService.generateRefreshToken("user", {
//           id: user._id.toString(),
//           email: user.email,
//           role: "user",
//         });

//         // Pass the user and tokens to the `done` callback
//         done(null, { user, accessToken, refreshToken });
//       } catch (error) {
//         done(error as Error, null);
//       }
//     }
//   )
// );

// // Serialize the user ID into the session
// passport.serializeUser((user: IUser, done: DoneCallback) => {
//   done(null, user.id); // Serialize only the user ID
// });

// // Deserialize the user from the session
// passport.deserializeUser(async (id: string, done: DoneCallback) => {
//   try {
//     const user = await userRepository.findById(id); // Fetch user by ID
//     if (user) {
//       done(null, { user, accessToken: "", refreshToken: "" }); // Pass a dummy object
//     } else {
//       done(new Error("User not found"), null);
//     }
//   } catch (error) {
//     done(error as Error, null);
//   }
// });
