
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function AuraLinkApp() {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [emotion, setEmotion] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [photo, setPhoto] = useState(null);
  const resultRef = useRef(null);

  const emotions = ["Radość", "Stres", "Lęk", "Smutek", "Spokój"];

  const getDominantColor = (imgSrc, callback) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        r += pixels[i];
        g += pixels[i + 1];
        b += pixels[i + 2];
      }
      const total = pixels.length / 4;
      r = Math.round(r / total);
      g = Math.round(g / total);
      b = Math.round(b / total);
      callback({ r, g, b });
    };
  };

  const getNumerology = (date) => {
    const digits = date.replace(/-/g, "").split("").map(Number);
    let total = digits.reduce((sum, d) => sum + d, 0);
    while (total > 9 && total !== 11 && total !== 22) {
      total = total.toString().split("").map(Number).reduce((sum, d) => sum + d, 0);
    }
    const meanings = {
      1: "Lider, niezależność, inicjatywa",
      2: "Współpraca, wrażliwość, dyplomacja",
      3: "Ekspresja, kreatywność, komunikacja",
      4: "Stabilność, odpowiedzialność, praca",
      5: "Zmiana, wolność, przygoda",
      6: "Miłość, harmonia, opieka",
      7: "Duchowość, introspekcja, mądrość",
      8: "Moc, sukces, materialność",
      9: "Empatia, humanitaryzm, zakończenia",
      11: "Wizjoner, duchowy przewodnik",
      22: "Mistrz budowniczy, manifestacja marzeń"
    };
    return { number: total, meaning: meanings[total] || "" };
  };

  const generateAnalysis = () => {
    const emotionMap = {
      "Radość": { auraColor: "Złota", chakraBlock: "Brak blokad", affirmation: "Promieniuję radością.", sound: "963 Hz", healthInsight: "Pełne zdrowie" },
      "Stres": { auraColor: "Czerwona", chakraBlock: "Czakra korzenia", affirmation: "Oddycham spokojem.", sound: "396 Hz", healthInsight: "Napięcie, brak snu" },
      "Lęk": { auraColor: "Fioletowa", chakraBlock: "Czakra trzeciego oka", affirmation: "Ufam sobie.", sound: "741 Hz", healthInsight: "Problemy trawienne" },
      "Smutek": { auraColor: "Szaro-błękitna", chakraBlock: "Czakra serca", affirmation: "Zasługuję na miłość.", sound: "528 Hz", healthInsight: "Zmęczenie, obniżona odporność" },
      "Spokój": { auraColor: "Turkusowa", chakraBlock: "Zharmonizowane", affirmation: "Trwam w harmonii.", sound: "432 Hz", healthInsight: "Równowaga" }
    };

    const emotionResult = emotionMap[emotion] || {};
    const numerology = getNumerology(birthdate);

    if (photo) {
      getDominantColor(photo, (color) => {
        let dominantAura = "Zielona";
        if (color.r > color.g && color.r > color.b) dominantAura = "Czerwona";
        else if (color.g > color.r && color.g > color.b) dominantAura = "Zielona";
        else if (color.b > color.r && color.b > color.g) dominantAura = "Niebieska";

        setAnalysis({
          ...emotionResult,
          auraColor: `${emotionResult.auraColor} + (${dominantAura} dominuje ze zdjęcia)`,
          numerology
        });
      });
    } else {
      setAnalysis({ ...emotionResult, numerology });
    }
  };

  const downloadPDF = () => {
    const input = resultRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save("AuraLink-analiza.pdf");
    });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <motion.h1 className="text-2xl font-bold mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        AuraLink – Analiza Energetyczna
      </motion.h1>

      <Card className="mb-4">
        <CardContent className="space-y-4">
          <Input placeholder="Twoje imię" value={name} onChange={(e) => setName(e.target.value)} />
          <Input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />

          <div className="space-y-2">
            <label>Wybierz dominującą emocję:</label>
            <select className="w-full p-2 border rounded" value={emotion} onChange={(e) => setEmotion(e.target.value)}>
              <option value="">-- wybierz --</option>
              {emotions.map((em, idx) => (
                <option key={idx} value={em}>{em}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label>Dodaj zdjęcie (kamerka lub plik):</label>
            <Input type="file" accept="image/*" capture="user" onChange={(e) => setPhoto(URL.createObjectURL(e.target.files[0]))} />
            {photo && <img src={photo} alt="Aura" className="mt-2 w-32 h-32 object-cover rounded-full border" />}
          </div>

          <Button onClick={generateAnalysis}>Rozpocznij analizę</Button>
        </CardContent>
      </Card>

      {analysis && (
        <motion.div ref={resultRef} className="bg-white p-4 rounded-xl shadow-xl space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-semibold">Wyniki analizy:</h2>
          <p><strong>Kolor aury:</strong> {analysis.auraColor}</p>
          <p><strong>Blokada energetyczna:</strong> {analysis.chakraBlock}</p>
          <p><strong>Afirmacja:</strong> "{analysis.affirmation}"</p>
          <p><strong>Dźwięk korekcyjny:</strong> {analysis.sound}</p>
          <p><strong>Wskazówki zdrowotne:</strong> {analysis.healthInsight}</p>
          <p><strong>Numerologia:</strong> {analysis.numerology.number} – {analysis.numerology.meaning}</p>
          <Button onClick={downloadPDF}>Pobierz PDF z analizą</Button>
        </motion.div>
      )}
    </div>
  );
}
