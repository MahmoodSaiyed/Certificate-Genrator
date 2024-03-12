import React, { useRef, useState } from "react";

import "./home.css";
import Logo from "../cert_templates/logo.png";
import Logo2 from "../cert_templates/logo-2.png";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import Certificate from "./Certificate";
// import domtoimage from "dom-to-image";
import { font } from "./AbrilFatface-Regular-normal";
import { font1 } from "./PT Serif-normal";

export default function Home() {
  const [name, setname] = useState("");
  const [desc, setdesc] = useState("");
  const [desc1, setdesc1] = useState("");
  const [desc2, setdesc2] = useState("");
  // eslint-disable-next-line
  const componentRef = useRef();
  const [theme, setTheme] = useState("dark");
  const [isChecked, setChecked] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  // eslint-disable-next-line
  const [paused, setPaused] = useState(false);
  const [bulkNamesFile, setBulkNamesFile] = useState(null);
  const [fontSize, setFontSize] = useState(40);
  const [fontFamily, setFontFamily] = useState("Abril Fatface");

  //fontfamily options
  const allFontFamilies = [
    "Arial",
    "Abril Fatface",
    "Times New Roman",
    "Helvetica",
    "Courier",
    "Georgia",
    "Verdana",
    "Impact",
    "Arial Black",
    "Book Antiqua",
    "PT Serif",
  ];

  //for bulkupload checkbox
  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  };

  // Pdf download
  //   const downloadAsPDF = () => {
  //     const input = document.getElementById("template1");
  //     html2canvas(input, {
  //       scale: 3,
  //       allowTaint: true,
  //       useCORS: true,
  //       logging: false,
  //       letterRendering: true,
  //       width: input.offsetWidth,
  //       height: input.offsetHeight,
  //       autoPrint: true,
  //     }).then((canvas) => {
  //       const imgData = canvas.toDataURL('image/png');
  //       const pdfWidthMm = 210; // A4 width in mm
  //       const pdfHeightMm = (pdfWidthMm / canvas.width) * canvas.height; // A4 aspect ratio
  //       const pdf = new jsPDF('l', 'mm', [pdfWidthMm, pdfHeightMm]);
  //       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidthMm, pdfHeightMm);
  //       pdf.save(`${name}_certificate.pdf`);
  //     });
  //   };

  //Download PDF
  const downloadAsPDF = () => {
    // const input = document.getElementById("template1");
    const pdfWidthMm = 860;
    const pdfHeightMm = 635;

    // Define the font family and font size styles
    const fontFamilyStyle = `font-family: '${fontFamily}'`;
    const fontSizeStyle = `font-size: ${fontSize}px;`;

    const fontStyle = `${fontFamilyStyle} ${fontSizeStyle}`;

    // Construct HTML content with inline styles
    const htmlContentWithStyles = `
    <div style="${fontStyle}">
      ${componentRef.current.innerHTML}
    </div>
  `;
    // Create jsPDF instance
    const pdf = new jsPDF({
      unit: "mm",
      format: [pdfWidthMm, pdfHeightMm],
      orientation: "landscape",
    });
    pdf.addFileToVFS("Abril Fatface-normal.ttf", font);
    pdf.addFont("Abril Fatface-normal.ttf", "Abril Fatface", "normal");
    pdf.setFont("Abril Fatface");
    pdf.addFileToVFS("PT Serif-normal.ttf", font1);
    pdf.addFont("PT Serif-normal.ttf", "PT Serif", "normal");
    pdf.setFont("PT Serif");

    // Add HTML content with styles to the PDF
    pdf.html(htmlContentWithStyles, {
      callback: (pdf) => {
        // Save the PDF with the given name
        pdf.save(`${name}_certificate.pdf`);
      },
      x: 10,
      y: 12.4,
      width: pdfWidthMm,
    });
  };

  //Dowanload Image
  const downloadAsJPG = () => {
    const input = document.getElementById("template1");
    const templateWidth = input.offsetWidth;
    const templateHeight = input.offsetHeight;
    const scaleFactor = Math.min(3368 / templateWidth, 2380 / templateHeight);

    html2canvas(input, { scale: scaleFactor }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${name}_certificate.jpg`;
      link.click();
    });
  };

  const handleBulkNamesUpload = (e) => handleFileUpload(e, setBulkNamesFile);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  //make text bold inbetween *
  const parseText = (text) => {
    const parts = text.split("*");
    return parts.map((part, index) => {
      return index % 2 === 0 ? part : <b key={index}>{part}</b>;
    });
  };

  const handleDescChange = (e) => {
    const inputText = e.target.value;
    const formattedText =
      inputText.trim() === ""
        ? "Student of Anand Niketan Shilaj, Ahmedabad"
        : parseText(inputText);
    setdesc(formattedText);
  };
  const handleDescChange1 = (e) => {
    const inputText = e.target.value;
    const formattedText =
      inputText.trim() === ""
        ? "for successfully participating in a Balaram Trip on 10th January 2024"
        : parseText(inputText);
    setdesc1(formattedText);
  };
  const handleDescChange2 = (e) => {
    const inputText = e.target.value;
    const formattedText =
      inputText.trim() === ""
        ? "to promote Intangible Cultural Heritage"
        : parseText(inputText);
    setdesc2(formattedText);
  };
  const handleBulkClick = () => {
    document.getElementById("bulkNames").click();
  };

  //fileupload
  const handleFileUpload = (e, setterFunction) => {
    const file = e.target.files[0];
    setterFunction(file);
  };
  //Genrate pdf in bulk
  const generatePDFsFromBulkNames = async () => {
    try {
      if (!bulkNamesFile) {
        console.error("No file uploaded.");
        alert("No CSV file uploaded.");
        return;
      }
      //reading name from the csv file
      const text = await bulkNamesFile.text();
      const namesArray = text.split("\n").map((line) => line.trim());

      const zip = new JSZip();
      const totalFiles = namesArray.length;

      for (let i = currentFileIndex; i < totalFiles; i++) {
        if (paused) {
          // If paused, update the current file index and exit the loop
          setCurrentFileIndex(i);
          return;
        }

        const names = namesArray[i];
        setname(names);
        await delay(10);

        //Genrationg Zip File having bulkof pdf
        const canvas = await html2canvas(document.getElementById("template1"), {
          scale: 4,
        });
        const imageData = canvas.toDataURL("image/jpeg");

        const pdf = new jsPDF("l", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const scale = Math.min(
          pdfWidth / canvas.width,
          pdfHeight / canvas.height
        );
        const imgWidth = canvas.width * scale;
        const imgHeight = canvas.height * scale;

        pdf.addImage(
          imageData,
          "PNG",
          (pdfWidth - imgWidth) / 2,
          (pdfHeight - imgHeight) / 2,
          imgWidth,
          imgHeight
        );

        const Rand = Math.floor(Math.random() * 1000) + 1;

        zip.file(`${names}_certificate_${Rand}.pdf`, pdf.output("blob"));
      }

      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });

      // Download the zip file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipBlob);
      link.download = "certificates.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setCurrentFileIndex(0); // Reset current file index
      setname("");
    } catch (error) {
      console.error("Error generating PDFs:", error);
      setCurrentFileIndex(0); // Reset current file index
      setname("");
    }
  };
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return (
    <div
      className="main"
      style={{ background: theme === "dark" ? "rgb(28, 39, 43)" : "white" }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <img src={Logo} alt="" />
        <div
          class={`form-check form-switch text-${
            theme === "light" ? "dark" : "light"
          }`}
        >
          <input
            class="form-check-input"
            onClick={() => toggleTheme()}
            type="checkbox"
            id="toggler"
            style={{ backgroundColor: theme === "dark" ? "white" : "black" }}
          />
          <label
            class="form-check-label"
            id="label"
            for="flexSwitchCheckDefault"
          >
            {" "}
            {theme === "light" ? "Dark Theme" : "Light Theme"}
          </label>
        </div>
        {/* <button id="toggler" className="my-4" onClick={() => toggleTheme()}>
          {theme === "light" ? "Dark Theme" : "Light Theme"}
        </button> */}
        <h2 style={{ color: theme === "dark" ? "white" : "rgb(28, 39, 43)" }}>
          Certificate Generator
        </h2>
        <img src={Logo2} alt="" />
      </header>

      <div className="maincontainer">
        <div className="leftmost"></div>
        <div className="middle" ref={componentRef}>
          <Certificate
            name={name}
            desc={desc}
            fontFamily={fontFamily}
            fontSize={fontSize}
            desc1={desc1}
            desc2={desc2}
          />
        </div>
        <div className="right">
          <div className="form">
            <div className="input-box">
              <span
                className="details"
                style={{
                  color: theme === "dark" ? "white" : "rgb(28, 39, 43)",
                }}
              >
                Particpant Name
              </span>{" "}
              <br />
              <input
                type="text"
                style={{ width: "200px" }}
                placeholder="Enter participant Name"
                onChange={(e) => {
                  setname(e.target.value);
                }}
              />
            </div>
            <div className="input-box">
              <span
                className="details"
                style={{
                  color: theme === "dark" ? "white" : "rgb(28, 39, 43)",
                }}
              >
                Description
              </span>{" "}
              <br />
              <textarea
                type="text"
                style={{ width: "200px", height: "40px" }}
                placeholder="Line 1"
                onChange={handleDescChange}
              />
            </div>
            <div className="input-box">
              <textarea
                type="text"
                style={{ width: "200px", height: "40px" }}
                placeholder="Line 2"
                onChange={handleDescChange1}
              />
            </div>
            <div className="input-box">
              <textarea
                type="text"
                style={{ width: "200px", height: "40px" }}
                placeholder="Line 3"
                onChange={handleDescChange2}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="fontFamily"
                style={{
                  color: theme === "dark" ? "white" : "rgb(28, 39, 43)",
                }}
              >
                Font Family:
              </label>{" "}
              <br />
              <select
                id="fontFamily"
                name="fontFamily"
                style={{ width: "200px", height: "40px" }}
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
              >
                {allFontFamilies.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label
                htmlFor="fontSize"
                style={{
                  color: theme === "dark" ? "white" : "rgb(28, 39, 43)",
                }}
              >
                Font Size:
              </label>{" "}
              <br />
              <select
                id="fontSize"
                name="fontSize"
                value={fontSize}
                style={{ width: "200px", height: "40px" }}
                onChange={(e) => setFontSize(e.target.value)}
              >
                {["35", "37", "39", "40", "42", "44", "46", "48", "50"].map(
                  (font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  )
                )}
              </select>
            </div>
            <label
              style={{ color: theme === "dark" ? "white" : "rgb(28, 39, 43)" }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              Bulk Upload
            </label>
            {isChecked && (
              <div className="form-group">
                <div className="custom-file">
                  <input
                    type="file"
                    id="bulkNames"
                    accept=".csv"
                    onChange={handleBulkNamesUpload}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className="choose-btn"
                    onClick={handleBulkClick}
                    style={{ width: "100%", display: "block" }}
                  >
                    Choose File
                  </button>
                </div>
              </div>
            )}
            {!isChecked && (
              <div className="button-container">
                <button className="generate" onClick={downloadAsPDF}>
                  PDF
                </button>
                <button className="generate" onClick={downloadAsJPG}>
                  JPG
                </button>
              </div>
            )}
            {isChecked && (
              <button
                className="btn-primary"
                onClick={generatePDFsFromBulkNames}
              >
                Generate PDFs
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
