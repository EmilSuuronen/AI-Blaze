import JSZip from "jszip";
import FileSaver from "file-saver";

export async function downloadProjectAsZip(
  projectName,
  htmlContent,
  cssContent
) {
  try {
    const zip = new JSZip();

    zip.file(`${projectName}.html`, htmlContent);

    zip.file("style.css", cssContent);

    // Generate the zip file
    const content = await zip.generateAsync({ type: "blob" });

    FileSaver.saveAs(content, `${projectName}.zip`);
  } catch (error) {
    console.error("Failed to create and download zip file:", error);
  }
}
