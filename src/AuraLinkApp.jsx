import { useState } from "react";
import { motion } from "framer-motion";

export default function AuraLinkApp() {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [emotion, setEmotion] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [photo, setPhoto] = useState(null);

  const emotions = ["Radość", "Stres", "Lęk", "Smutek", "Spokój"];

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const generateAnalysis = () => {
    const result = {
      auraColor: "Niebieska z nutą zieleni",
      chakraBlock: "Czakra gardła – komunikacja",
      affirmation: "Mówię swoją prawdę z odwagą i spokojem.",
      sound: "528 Hz – Uzdrawiająca częstotliwość miłości"
    };
    setAnalysis(result);
  };

  return (
    <div className="p-6 max-w-xl mx-auto font-sans">
      <motion.h1 className="text-2xl font-bold mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        AuraLink – Analiza Energetyczna
      </motion.h1>

      <div className="mb-4 bg-white rounded-xl shadow-md p-4 space-y-4">
        <input className="w-full p-2 border rounded" placeholder="Twoje imię" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full p-2 border rounded" type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />

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
          <input className="w-full p-2 border rounded" type="file" accept="image/*" capture="user" onChange={handlePhotoUpload} />
          {photo && <img src={photo} alt="Aura" className="mt-2 w-32 h-32 object-cover rounded-full border" />}
        </div>

        <button onClick={generateAnalysis} className="w-full p-2 bg-blue-500 text-white rounded">
          Rozpocznij analizę
        </button>
      </div>

      {analysis && (
        <motion.div
          className="bg-white p-4 rounded-xl shadow-xl space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold">Wyniki analizy:</h2>
          <p><strong>Kolor aury:</strong> {analysis.auraColor}</p>
          <p><strong>Blokada energetyczna:</strong> {analysis.chakraBlock}</p>
          <p><strong>Afirmacja:</strong> "{analysis.affirmation}"</p>
          <p><strong>Dźwięk korekcyjny:</strong> {analysis.sound}</p>
          <button className="mt-4 p-2 bg-green-500 text-white rounded">Wyślij korekcję energetyczną</button>
        </motion.div>
      )}
    </div>
  );
}