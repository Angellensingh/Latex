import React, { useEffect, useState } from "react";
import './App.css'; // Import the external CSS file

const App = () => {
  const [readableContent, setReadableContent] = useState(""); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    fetch("/assets/latex/Original Tex.tex") 
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch the LaTeX file: ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then((latexContent) => {
        const parsedContent = parseLatexToReadableText(latexContent); 
        setReadableContent(parsedContent);
      })
      .catch((err) => {
        console.error("Error processing the LaTeX file:", err);
        setError(err.message);
      });
  }, []);

  const parseLatexToReadableText = (latex) => {
    return latex

      .replace(/%.*$/gm, "")
      .replace(/\\usepackage\[.*?\]\{.*?\}/g, "")
      .replace(/\\documentclass\[.*?\]\{.*?\}/g, "")

      .replace(/\\begin\{threecolentry\}\{(.*?)\}\{(.*?)\}/g, '<div class="three-col-entry"><div class="col left">$1</div><div class="col right">$2</div><div class="col middle">')
      .replace(/\\end\{threecolentry\}/g, '</div></div>')

      .replace(/pdftitle=(.*?),/g, (_, title) => `<div><strong>Title:</strong> ${title.trim()}</div>`)
      .replace(/pdfauthor=(.*?),/g, (_, author) => `<div><strong>Author:</strong> ${author.trim()}</div>`)
      .replace(/pdfcreator=(.*?)[,\]]/g, (_, creator) => `<div><strong>Creator:</strong> ${creator.trim()}</div>`)
      
      .replace(/\\section\{(.*?)\}/g, (_, title) => `<h2 class="section-title">${title}</h2>`)
      .replace(/\\subsection\{(.*?)\}/g, (_, title) => `<h3 class="section-title">${title}</h3>`)
      .replace(/\\begin\{onecolentry\}/g, '<div>') 
        .replace(/\\end\{onecolentry\}/g, '</div>') 
        .replace(/\\textbf\{(.*?)\}/g, (_, text) => `<strong>${text}</strong>`) 

        
     
      .replace(/\\kern\s*([\d.]+)\s*pt/g, (_, spacing) => `<span style="margin-left: ${spacing}pt;"></span>`)
      // .replace(/\\href\{(.*?)\}\{(.*?)\}/g, (_, url, text) => `<a href="${url}" target="_blank">${text}</a>`)
      // .replace(/\\url\{(.*?)\}/g, (_, url) => `<a href="${url}" target="_blank">${url}</a>`)
  
      .replace(/\\begin\{itemize\}/g, "<ul>")
      .replace(/\\end\{itemize\}/g, "</ul>")
      .replace(/\\begin\{enumerate\}/g, "<ol>")
      .replace(/\\end\{enumerate\}/g, "</ol>")
      .replace(/\\item/g, "<li>")
      .replace(/<\/li>\s*<li>/g, "</li><li>") 
  
      
      .replace(/\\newline|\\\\/g, "<br>")
      .replace(/\s{2,}/g, " ") 
  
      .replace(/\\[a-zA-Z]+\*?\{.*?\}/g, "") 
      .replace(/\\[a-zA-Z]+/g, "") 
      .replace(/[\{\}]/g, "") 
  
      .trim(); 
  };

  return (
    <div className="container">
      <h1 className="title">Readable LaTeX Content</h1>
      {error ? (
        <p className="error">Error: {error}</p>
      ) : (
        <div className="content">
          <div contentEditable='true' dangerouslySetInnerHTML={{ __html: readableContent || "Loading..." }} />
        </div>
      )}
    </div>
  );
};

export default App;



