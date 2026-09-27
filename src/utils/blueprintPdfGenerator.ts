import jsPDF from 'jspdf';
import { Project } from '../data/projectsData';

export const generateProjectPdf = (project: Project) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background tint
  doc.setFillColor(250, 249, 246);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header border line
  doc.setDrawColor(200, 169, 110);
  doc.setLineWidth(1.2);
  doc.line(15, 15, pageWidth - 15, 15);

  // Studio branding
  doc.setTextColor(30, 30, 30);
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.text('MOHALKAR ARCHITECTS & PLANNERS', 15, 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 110, 95);
  doc.text('ARCHITECTURE · URBAN PLANNING · INTERIORS · STATUTORY SANCTIONS', 15, 29);

  doc.setFontSize(8);
  doc.text(`DOC-REF: MAP-PRJ-${project.id.toUpperCase().substring(0, 8)}`, pageWidth - 15, 24, { align: 'right' });
  doc.text(`DATE: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 15, 29, { align: 'right' });

  doc.setDrawColor(220, 210, 190);
  doc.setLineWidth(0.4);
  doc.line(15, 34, pageWidth - 15, 34);

  // Project Title
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(20, 20, 20);
  doc.text(project.title, 15, 46);

  // Category & Status Badge line
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(163, 130, 71);
  doc.text(`TYPOLOGY: ${project.category.toUpperCase()}   |   STATUS: ${project.status.toUpperCase()}   |   YEAR: ${project.year}`, 15, 53);

  // Spec Grid Box
  doc.setFillColor(242, 239, 232);
  doc.rect(15, 58, pageWidth - 30, 26, 'F');
  doc.setDrawColor(200, 169, 110);
  doc.rect(15, 58, pageWidth - 30, 26, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 90, 80);
  doc.text('LOCATION', 20, 65);
  doc.text('SUPER BUILT-UP AREA', 75, 65);
  doc.text('BUDGET TIER', 135, 65);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(20, 20, 20);
  doc.text(project.location, 20, 74);
  doc.text(project.area, 75, 74);
  doc.text(project.budgetTier || 'Ultra Luxury', 135, 74);

  // Description & Narrative
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text('1. Architectural Executive Summary', 15, 96);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(60, 60, 60);
  const descLines = doc.splitTextToSize(project.description, pageWidth - 30);
  doc.text(descLines, 15, 103);

  // Concept & Structural Philosophy
  const nextY = 105 + (descLines.length * 5);
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text('2. Bioclimatic Concept & Engineering Rationale', 15, nextY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(60, 60, 60);
  const conceptLines = doc.splitTextToSize(project.concept, pageWidth - 30);
  doc.text(conceptLines, 15, nextY + 15);

  // Scope of Deliverables
  const scopeY = nextY + 17 + (conceptLines.length * 5);
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text('3. Commission Scope & Statutory Compliance', 15, scopeY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  project.scope.forEach((item, idx) => {
    doc.text(`•  ${item}`, 20, scopeY + 16 + (idx * 5.5));
  });

  // Footer seal
  const footerY = pageHeight - 20;
  doc.setDrawColor(200, 169, 110);
  doc.setLineWidth(0.6);
  doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);

  doc.setFontSize(7.5);
  doc.setTextColor(120, 110, 95);
  doc.text('MOHALKAR ARCHITECTS & PLANNERS | Pune · Mumbai · Maharashtra', 15, footerY);
  doc.text('Confidential Architectural Portfolio Plate · All Rights Reserved', pageWidth - 15, footerY, { align: 'right' });

  doc.save(`${project.id}-architectural-plate.pdf`);
};

export const generateCostEstimatePdf = (data: {
  typology: string;
  sqft: number;
  qualityTier: string;
  estimatedCostMin: number;
  estimatedCostMax: number;
  clientName?: string;
  clientPhone?: string;
}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background tint
  doc.setFillColor(252, 251, 249);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header border
  doc.setDrawColor(200, 169, 110);
  doc.setLineWidth(1.2);
  doc.line(15, 15, pageWidth - 15, 15);

  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30, 30, 30);
  doc.text('MOHALKAR ARCHITECTS & PLANNERS', 15, 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 110, 95);
  doc.text('PRELIMINARY ARCHITECTURAL BUDGET & FEASIBILITY ESTIMATE', 15, 29);

  doc.setFontSize(8);
  doc.text(`REF: EST-${Date.now().toString().slice(-6)}`, pageWidth - 15, 24, { align: 'right' });
  doc.text(`DATE: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 15, 29, { align: 'right' });

  // Main Card Box
  doc.setFillColor(242, 239, 232);
  doc.rect(15, 40, pageWidth - 30, 48, 'F');
  doc.setDrawColor(200, 169, 110);
  doc.rect(15, 40, pageWidth - 30, 48, 'S');

  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text('Project Parameters', 20, 49);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(110, 100, 90);
  doc.text('TYPOLOGY', 20, 58);
  doc.text('TOTAL BUILT-UP AREA', 75, 58);
  doc.text('SPECIFICATION TIER', 135, 58);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.text(data.typology, 20, 65);
  doc.text(`${data.sqft.toLocaleString('en-IN')} sq.ft`, 75, 65);
  doc.text(data.qualityTier, 135, 65);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(110, 100, 90);
  doc.text('PREPARED FOR', 20, 75);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(20, 20, 20);
  doc.text(data.clientName || 'Valued Studio Client', 20, 82);

  // Total Estimate Range
  doc.setFillColor(232, 224, 208);
  doc.rect(15, 96, pageWidth - 30, 36, 'F');
  doc.setDrawColor(163, 130, 71);
  doc.setLineWidth(0.8);
  doc.rect(15, 96, pageWidth - 30, 36, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(140, 100, 40);
  doc.text('ESTIMATED CONSTRUCTION & DESIGN BUDGET RANGE', 20, 105);

  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 30, 30);
  doc.text(
    `₹${(data.estimatedCostMin / 100000).toFixed(2)} Lakhs  –  ₹${(data.estimatedCostMax / 100000).toFixed(2)} Lakhs`,
    20,
    118
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 95, 85);
  doc.text('*Excludes statutory land acquisition & municipal premium taxes. Subject to exact contour topology & finish schedules.', 20, 126);

  // Notes
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text('Consultation Next Steps', 15, 145);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text('1. Initial Site Inspection & Contour Topographic Survey', 20, 154);
  doc.text('2. Bioclimatic Concept Massing & Feasibility Blueprint Presentation', 20, 161);
  doc.text('3. Municipal UDCPR 2020 Sanction Clearances & Structural Engineering', 20, 168);
  doc.text('4. Bill of Quantities (BOQ) & Tender Package for Certified Civil Contractors', 20, 175);

  // Footer
  const footerY = pageHeight - 20;
  doc.setDrawColor(200, 169, 110);
  doc.setLineWidth(0.6);
  doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);

  doc.setFontSize(7.5);
  doc.setTextColor(120, 110, 95);
  doc.text('MOHALKAR ARCHITECTS & PLANNERS | Pune · Maharashtra', 15, footerY);
  doc.text('Architectural Feasibility Statement · All Rights Reserved', pageWidth - 15, footerY, { align: 'right' });

  doc.save(`mohalkar-feasibility-estimate.pdf`);
};
