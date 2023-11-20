/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import './Modal.css';
import moment from 'moment';

// import { IoIosCheckmarkCircle } from 'react-icons/io';
// import { MdDeleteForever } from 'react-icons/md';
// import { FiCircle } from 'react-icons/fi';

interface ModalProps {
  selectedDate: Date;
  showModal: boolean;
  toggleModal: () => void;
  formDataArray: any[];
  editMode: boolean;
  setEditMode: (arg0: boolean) => void;
  idNote: number;
}

const Modal: React.FC<ModalProps> = ({
  selectedDate,
  showModal,
  toggleModal,
  formDataArray,
  editMode,
  setEditMode,
  idNote
}) => {
  const [notes, setNotes] = useState<any[] | any>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: moment(selectedDate).format('DD.MM.YYYY'),
    time: '',
    id: Math.random()
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const storedData = localStorage.getItem('formDataArray');
    const formDataArray = storedData ? JSON.parse(storedData) : [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 1; i++) {
      formDataArray.push(formData);
    }

    localStorage.setItem('formDataArray', JSON.stringify(formDataArray));

    setNotes(storedData);
    toggleModal();
    if (editMode) {
      setEditMode(false);
    }
  };

  const deleteNote = (id: any) => {
    const newNotes = notes.filter((note: { id: any }) => note.id !== id);
    setNotes([...newNotes]);
  };

  const dataNote = formDataArray.filter((item) => item.id === idNote);

  return (
    <div>
      {showModal && (
        <div className='modal-overlay'>
          <div className='modal'>
            <form onSubmit={handleSubmit}>
              <div className='modal-content'>
                {!editMode ? (
                  <div className='modal-content-title'>
                    <span>Add new idea item</span>
                    <span
                      aria-hidden='true'
                      className='modal-content-title-cancel'
                      onClick={() => toggleModal()}
                    >
                      x
                    </span>
                  </div>
                ) : (
                  <div className='modal-content-title'>
                    <div>
                      <span>Adit idea item</span>
                      <span className='modal-content-subtitle'>
                        Created at: {moment(selectedDate).format('DD.MM.YYYY hh:mm')}
                      </span>
                    </div>

                    <span
                      aria-hidden='true'
                      className='modal-content-title-cancel'
                      onClick={() => {
                        toggleModal();
                        setEditMode(false);
                      }}
                    >
                      x
                    </span>
                  </div>
                )}
                <input
                  type='text'
                  name='title'
                  value={formData.title}
                  className='custom__input'
                  onChange={handleInputChange}
                  placeholder='TItle *'
                  required
                />
                <div>
                  <hr />
                </div>

                <textarea
                  name='description'
                  value={formData.description}
                  className='custom__input'
                  onChange={handleInputChange}
                  placeholder='description'
                />
                <div>
                  <hr />
                </div>

                <div>
                  <input
                    type='text'
                    name='date'
                    value={formData.date}
                    className='custom__input'
                    placeholder='Data *'
                  />

                  <input
                    type='time'
                    name='time'
                    value={formData.time}
                    className='custom__input'
                    onChange={handleInputChange}
                    placeholder='Time'
                  />
                  <hr />
                </div>

                <div>
                  {!editMode ? null : <button>Remove</button>}

                  <button type='submit' className='btn'>
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* <div className='note-container'>
        {notes.map((noteItem: { id: any; note: any; complete: any }) => {
          const { id, note, complete } = noteItem;
          return (
            <div key={id} className='note-card'>
              <div className='icon' onClick={() => toggleComplete(id)}>
                {!complete ? (
                  <FiCircle />
                ) : (
                  <IoIosCheckmarkCircle className={complete ? 'icon-done' : ''} />
                )}
              </div>
              <p className={complete ? 'text-done' : ''}>{note}</p>
              <MdDeleteForever onClick={() => deleteNote(id)} className='icon delete-icon' />
            </div>
          );
        })}
      </div> */}
    </div>
  );
};

export default Modal;
