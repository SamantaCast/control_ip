"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {

  const [impresoras, setImpresoras] = useState([]);

  const cargar = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras`
    );

    setImpresoras(res.data);
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Impresoras</h1>

      {impresoras.map((i: any) => (
        <p key={i._id}>
          {i.nombre} - {i.modelo} - {i.estado}
        </p>
      ))}
    </div>
  );
}