import { writeFileSync } from "node:fs";

const projectId = process.argv[2];
if (
  !projectId ||
  !/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(projectId) ||
  projectId === "your-firebase-project-id"
) {
  console.error("Usage: npm run firebase:configure -- YOUR_REAL_PROJECT_ID");
  console.error(
    "Use the project ID shown in Firebase console > Project settings (6–30 lowercase letters, digits or hyphens).",
  );
  process.exit(1);
}
writeFileSync(
  new URL("../.firebaserc", import.meta.url),
  `${JSON.stringify({ projects: { default: projectId } }, null, 2)}\n`,
);
console.log(
  `Created .firebaserc for ${projectId}. This local file is ignored by Git.`,
);
console.log(
  `Also add GitHub Actions variable FIREBASE_PROJECT_ID = ${projectId}. See docs/FIREBASE_SETUP.md.`,
);
