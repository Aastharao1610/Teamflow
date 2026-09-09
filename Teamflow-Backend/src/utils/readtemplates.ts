import fs from "fs/promises";
import path from "path";

export const readTemplate = async (
  fileName: string,
  replacements: Record<string, string>
) => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "templates",
    fileName
  );

  let html = await fs.readFile(templatePath, "utf-8");

  for (const [key, value] of Object.entries(replacements)) {
    html = html.replaceAll(
      `{{${key}}}`,
      value
    );
  }

  return html;
};
