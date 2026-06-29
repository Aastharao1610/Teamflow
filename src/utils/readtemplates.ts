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

  for (const key in replacements) {
    html = html.replaceAll(
      `{{${key}}}`,
      replacements[key]
    );
  }

  return html;
};