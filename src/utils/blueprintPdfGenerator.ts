import { jsPDF } from "jspdf";
import { ProjectItem } from "../data/projectsData";

/**
 * Loads an image from URL and returns a base64 Data URL for jsPDF embedding.
 */
async function getBase64ImageFromUrl(imageUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width || 800;
        canvas.height = img.naturalHeight || img.height || 600;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        resolve(dataUrl);
      } catch (e) {
        console.warn("Canvas export failed for image:", imageUrl, e);
        resolve(null);
      }
    };
    img.onerror = () => {
      console.warn("Failed to load image for PDF:", imageUrl);
      resolve(null);
    };
    img.src = imageUrl;
  });
}

/**
 * Generates and triggers a download of a high-fidelity Architectural Sample Blueprint PDF.
 */
export async function downloadSampleBlueprint(
  project: ProjectItem,
  onProgress?: (status: string) => void
): Promise<boolean> {
  try {
    if (onProgress) onProgress("Preparing architectural drawing plate...");

    // Create Landscape A4 Document: 297mm x 210mm
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 297;
    const pageHeight = 210;

    // Background Canvas - Deep Architectural Blueprint Midnight (#0b111e)
    doc.setFillColor(11, 17, 30);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Subtle Architectural Blueprint Grid (Lines every 10mm)
    doc.setDrawColor(20, 32, 54);
    doc.setLineWidth(0.15);
    for (let x = 10; x < pageWidth; x += 10) {
      doc.line(x, 8, x, pageHeight - 8);
    }
    for (let y = 10; y < pageHeight; y += 10) {
      doc.line(8, y, pageWidth - 8, y);
    }

    // Outer Blueprint Border (Double Line)
    doc.setDrawColor(200, 169, 110); // Architectural Gold #c8a96e
    doc.setLineWidth(0.8);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

    doc.setDrawColor(45, 60, 85);
    doc.setLineWidth(0.3);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Corner Alignment Marks (Architectural Crosshairs)
    const crosshairSize = 4;
    const corners = [
      [8, 8],
      [pageWidth - 8, 8],
      [8, pageHeight - 8],
      [pageWidth - 8, pageHeight - 8],
    ];
    doc.setDrawColor(200, 169, 110);
    doc.setLineWidth(0.4);
    corners.forEach(([cx, cy]) => {
      doc.line(cx - crosshairSize, cy, cx + crosshairSize, cy);
      doc.line(cx, cy - crosshairSize, cx, cy + crosshairSize);
    });

    // ── TOP BANNER: STUDIO WORDMARK & CLASSIFICATION ──
    doc.setFillColor(15, 23, 42);
    doc.rect(10, 10, pageWidth - 20, 14, "F");
    doc.setDrawColor(200, 169, 110);
    doc.setLineWidth(0.4);
    doc.line(10, 24, pageWidth - 10, 24);

    // Studio Name
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("MOHALKAR ARCHITECTS & PLANNERS", 15, 17);

    // Tagline / Practice Locations
    doc.setTextColor(200, 169, 110);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("DESIGN ATELIER · PUNE · BHOOM · DHARASHIV · PAN-INDIA", 15, 21.5);

    // Header Right: Document Security / Classification Stamp
    doc.setFillColor(200, 169, 110);
    doc.roundedRect(pageWidth - 80, 13, 66, 7, 1, 1, "F");
    doc.setTextColor(11, 17, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("SAMPLE BLUEPRINT SPECIFICATION SHEET", pageWidth - 78, 17.5);

    // ── MAIN DRAWING VIEWPORT (Left side: 175mm wide x 135mm high) ──
    const viewportX = 14;
    const viewportY = 28;
    const viewportW = 180;
    const viewportH = 128;

    doc.setFillColor(8, 12, 22);
    doc.rect(viewportX, viewportY, viewportW, viewportH, "F");
    doc.setDrawColor(35, 48, 70);
    doc.setLineWidth(0.4);
    doc.rect(viewportX, viewportY, viewportW, viewportH);

    // Try embedding image
    if (onProgress) onProgress("Rendering architectural drawing set...");
    const base64Img = await getBase64ImageFromUrl(project.image);

    if (base64Img) {
      try {
        // Draw inside viewport with padding
        doc.addImage(
          base64Img,
          "JPEG",
          viewportX + 2,
          viewportY + 2,
          viewportW - 4,
          viewportH - 4,
          undefined,
          "FAST"
        );
      } catch (err) {
        console.warn("Could not insert image into PDF:", err);
      }
    } else {
      // Fallback architectural schematic graphic
      doc.setDrawColor(200, 169, 110);
      doc.setLineWidth(0.3);
      doc.rect(viewportX + 10, viewportY + 10, viewportW - 20, viewportH - 20);
      doc.setTextColor(200, 169, 110);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("ARCHITECTURAL WORKING DRAWING", viewportX + 35, viewportY + 60);
      doc.setFontSize(9);
      doc.setTextColor(160, 175, 200);
      doc.text(project.title, viewportX + 35, viewportY + 68);
    }

    // Viewport Overlay Banner
    doc.setFillColor(11, 17, 30);
    doc.rect(viewportX, viewportY + viewportH - 10, viewportW, 10, "F");
    doc.setDrawColor(200, 169, 110);
    doc.setLineWidth(0.3);
    doc.line(viewportX, viewportY + viewportH - 10, viewportX + viewportW, viewportY + viewportH - 10);

    doc.setTextColor(200, 169, 110);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text(`PLATE REF: ${project.id.toUpperCase()} · ${project.tag.toUpperCase()}`, viewportX + 4, viewportY + viewportH - 4);

    doc.setTextColor(200, 210, 225);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(`SCALE: ${project.scale || "1:100 @ A3"} | NORTH ORIENTED`, viewportX + viewportW - 58, viewportY + viewportH - 4);

    // ── RIGHT SIDEBAR: TECHNICAL TITLE BLOCK & SPECS (85mm wide) ──
    const sbX = 198;
    const sbY = 28;
    const sbW = 85;
    const sbH = 168;

    // Sidebar Container
    doc.setFillColor(14, 21, 37);
    doc.rect(sbX, sbY, sbW, sbH, "F");
    doc.setDrawColor(200, 169, 110);
    doc.setLineWidth(0.5);
    doc.rect(sbX, sbY, sbW, sbH);

    // Title Block Header
    doc.setFillColor(20, 30, 52);
    doc.rect(sbX, sbY, sbW, 10, "F");
    doc.setDrawColor(200, 169, 110);
    doc.setLineWidth(0.3);
    doc.line(sbX, sbY + 10, sbX + sbW, sbY + 10);

    doc.setTextColor(200, 169, 110);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("PROJECT SPECIFICATION BLOCK", sbX + 4, sbY + 6.5);

    // Project Details Key-Value Matrix
    let curY = sbY + 16;
    const specFields = [
      { label: "PROJECT TITLE", value: project.title },
      { label: "TYPOLOGY", value: project.tag },
      { label: "LOCATION", value: project.location || "Maharashtra, India" },
      { label: "SCALE / SIZE", value: project.scale || "Custom Built-up" },
      { label: "PRINCIPAL ARCHITECT", value: "Abhishek Mohalkar (B.Arch)" },
      { label: "STATUTORY CODES", value: "NBC 2016 · Vaastu Calibrated" },
      { label: "DRAWING STATUS", value: "Approved For Client Review (GFC)" },
      { label: "ISSUED BY", value: "Mohalkar Architects & Planners" },
    ];

    specFields.forEach((field) => {
      doc.setTextColor(140, 155, 180);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      doc.text(field.label, sbX + 4, curY);

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);

      // Truncate long value
      const splitVal = doc.splitTextToSize(field.value, sbW - 8);
      doc.text(splitVal[0] || field.value, sbX + 4, curY + 4);

      doc.setDrawColor(25, 38, 62);
      doc.setLineWidth(0.2);
      doc.line(sbX + 4, curY + 6.5, sbX + sbW - 4, curY + 6.5);

      curY += 9;
    });

    // General Notes Section
    curY += 2;
    doc.setFillColor(20, 30, 52);
    doc.rect(sbX + 3, curY, sbW - 6, 6, "F");
    doc.setTextColor(200, 169, 110);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.text("GENERAL ARCHITECTURAL NOTES", sbX + 5, curY + 4.2);

    curY += 9;
    const generalNotes = [
      "1. All dimensions are in mm unless noted otherwise.",
      "2. Do not scale from drawing; follow written dims.",
      "3. RCC & structural details subject to consultant check.",
      "4. Natural ventilation & daylighting NBC compliant.",
    ];

    doc.setTextColor(170, 185, 205);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    generalNotes.forEach((note) => {
      doc.text(note, sbX + 4, curY);
      curY += 4.2;
    });

    // Stamp / Seal Box at bottom of sidebar
    curY += 3;
    doc.setDrawColor(200, 169, 110);
    doc.setLineWidth(0.4);
    doc.rect(sbX + 4, curY, sbW - 8, 26);

    doc.setTextColor(200, 169, 110);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("STUDIO AUTHENTICATION SEAL", sbX + 14, curY + 6);

    doc.setTextColor(220, 230, 245);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.text("Mohalkar Architects & Planners", sbX + 18, curY + 11);
    doc.text("Principal Architect: Abhishek Mohalkar", sbX + 13, curY + 15);
    doc.setTextColor(140, 160, 190);
    doc.text("Contact: +91 91460 79235", sbX + 24, curY + 19);
    doc.text("Date of Issue: March 2026", sbX + 23, curY + 23);

    // ── BOTTOM TECHNICAL FOOTER STRIP (Left 180mm) ──
    const footY = 160;
    doc.setFillColor(14, 21, 37);
    doc.rect(viewportX, footY, viewportW, 36, "F");
    doc.setDrawColor(35, 48, 70);
    doc.setLineWidth(0.3);
    doc.rect(viewportX, footY, viewportW, 36);

    doc.setTextColor(200, 169, 110);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text("ARCHITECTURAL SCOPE & CLIENT CONSULTATION NOTICE", viewportX + 4, footY + 6);

    doc.setTextColor(180, 195, 215);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    const scopeDesc = project.scope
      ? `Scope Description: ${project.scope}`
      : `This sample blueprint is an official excerpt from the executed portfolio of Mohalkar Architects & Planners.`;
    const splitScope = doc.splitTextToSize(scopeDesc, viewportW - 8);
    doc.text(splitScope, viewportX + 4, footY + 11);

    // Direct Inquiry Call-To-Action Box
    doc.setFillColor(20, 32, 54);
    doc.roundedRect(viewportX + 4, footY + 19, viewportW - 8, 13, 1, 1, "F");
    doc.setDrawColor(200, 169, 110);
    doc.setLineWidth(0.25);
    doc.roundedRect(viewportX + 4, footY + 19, viewportW - 8, 13, 1, 1, "S");

    doc.setTextColor(200, 169, 110);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("READY TO COMMISSION YOUR ARCHITECTURAL DRAWINGS?", viewportX + 8, footY + 24);

    doc.setTextColor(240, 245, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text(
      "WhatsApp: +91 91460 79235  |  Email: mohalkararchitectsandplanners@gmail.com  |  Web: mohalkararchitects.in",
      viewportX + 8,
      footY + 28.5
    );

    // Clean sanitized filename
    const cleanTitle = project.title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 35);
    const fileName = `Mohalkar_Blueprint_${project.id.toUpperCase()}_${cleanTitle}.pdf`;

    if (onProgress) onProgress("Finalizing PDF download...");
    doc.save(fileName);
    return true;
  } catch (error) {
    console.error("Error generating sample blueprint PDF:", error);
    return false;
  }
}
