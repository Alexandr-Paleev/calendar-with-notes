import React from 'react';

import './static/css/global.css';
import { Calendar } from './components/Calendar';
import Modal from './components/Modal';

export const App: React.FC = () => {
  const [selectedDate, setSelectedDay] = React.useState(new Date());
  const [showModal, setShowModal] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [idNote, setIdNote] = React.useState(0);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const storedData = localStorage.getItem('formDataArray');
  const formDataArray = storedData ? JSON.parse(storedData) : [];

  return (
    <div className='app__container'>
      <Calendar
        selectedDate={selectedDate}
        selectDate={(date) => setSelectedDay(date)}
        toggleModal={toggleModal}
        formDataArray={formDataArray}
        setEditMode={setEditMode}
        setIdNote={setIdNote}
      />

      {showModal && (
        <Modal
          showModal={showModal}
          toggleModal={toggleModal}
          selectedDate={selectedDate}
          formDataArray={formDataArray}
          editMode={editMode}
          setEditMode={setEditMode}
          idNote={idNote}
        />
      )}
    </div>
  );
};

export default App;
