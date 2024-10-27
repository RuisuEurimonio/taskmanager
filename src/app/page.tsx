"use client"

import { useState } from 'react';
import TableTarget from './components/tableTarget';
import GridLayout from './views/gridComponents';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function Home() {

  return (
    <>
  <div>

    </div>

    <div className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold text-gray-900">Bienvenido al Administrador de Tareas</h1>
        <p className="mt-4 text-lg text-gray-700">
          Aquí puedes gestionar tus tareas y proyectos de manera eficiente. A continuación, encontrarás un resumen de tus actividades.
        </p>

        <GridLayout />

        {/* Sección de Estadísticas */}
        <TableTarget />
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center' as 'center',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  input: {
    width: '75%',
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    fontSize: '18px',
  },
  deleteButton: {
    backgroundColor: '#e00',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    padding: '5px 10px',
  },
};
