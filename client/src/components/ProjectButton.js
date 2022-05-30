import React, { useEffect, useState, useContext } from 'react';
import { Modal, Button, FloatingLabel, Form } from 'react-bootstrap';
import { getResources, createProject } from '../utils/api';
import { AiOutlinePlus } from 'react-icons/ai';
import { ADD_PROJECT } from '../utils/mutations';
import { DataContext } from '../contexts/DataContext';
import { useMutation } from '@apollo/client';

export default function ProjectButton() {
  // bring in resoures and projects from context
  const { resources, setResources, projects, setProjects } =
    useContext(DataContext);
  // bring in mutations
  const [addProject, { data, loading, error }] = useMutation(ADD_PROJECT);
  const [show, setShow] = useState(false);
  const [personName, setPersonName] = useState([]);
  const [formData, setFormData] = useState([]);

  const [userinfo, setUserInfo] = useState({
    assignedResource: [],
  });

  const handleClose = () => {
    setShow(false);
    setPersonName([]);
    setFormData([]);
    window.location.reload();
  };
  const handleShow = () => setShow(true);
  // when an input is changed, set the form data state to new data
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // set PersonName state to resources(from context) this will be filtered through to display in the form selection for assigned resources
  useEffect(() => {
    // const getperson = async () => {
    //   const res = await getResources();
    //   if (!res.ok) {
    //     console.log('error namees');
    //   }
    //   const data = await res.json();
    //   console.log('data for you', data);

    //   setPersonName(data);
    // };
    // getperson();
    setPersonName(resources);
  }, []);

  const handleChange2 = (e) => {
    console.log(e.target);
    const { value, checked } = e.target;
    const { assignedResource } = userinfo;
    if (checked) {
      setUserInfo({
        assignedResource: [...assignedResource, value],
      });
    }
  };

  const handleProjectData = async (e) => {
    e.preventDefault();
    console.log('check availaboy', formData);
    const submitData = {
      ...formData,
      assignedResource: userinfo.assignedResource,
    };
    console.log(submitData);
    const res = await createProject([userinfo.assignedResource, formData]);
    console.log('check my data', formData, userinfo.assignedResource);
    if (!res.ok) {
      throw new Error('something went wrong!');
    }
    window.alert('Project created sucessfully');
    setFormData([]);
    setPersonName([]);
    setShow(false);
    window.location.reload();
  };

  useEffect(() => {
    const filterResources = resources.filter(
      (newData) => newData.availability >= formData.allocation
    );
    setPersonName(filterResources);
    console.log(personName);
  }, [formData.allocation]);

  return (
    <>
      <Button variant='success' onClick={handleShow}>
        <AiOutlinePlus />
        Add new project
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <FloatingLabel
              controlId='floatingInput'
              label='Add Project Name'
              className='mb-3'
            >
              <Form.Control
                type='text'
                name='title'
                onChange={handleInputChange}
              />
            </FloatingLabel>

            <FloatingLabel label='Add Description' className='mb-3'>
              <Form.Control
                type='text'
                name='description'
                onChange={handleInputChange}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId='floatingSelect'
              label='allocation of resources per percentage  '
              className='mb-3'
            >
              <Form.Select
                aria-label='Floating label select example'
                name='allocation'
                onChange={handleInputChange}
              >
                <option value=''></option>

                <option value='25'>25%</option>
                <option value='50'>50%</option>
                <option value='75'>75%</option>
                <option value='100'>100%</option>
              </Form.Select>
            </FloatingLabel>

            <FloatingLabel label='Required Resources Number' className='mb-3'>
              <Form.Control
                type='number'
                min='1'
                max='50'
                name='requiredResNumber'
                onChange={handleInputChange}
              />
            </FloatingLabel>

            <FloatingLabel label='started Daye' className='mb-3'>
              <Form.Control
                type='date'
                name='createdAt'
                onChange={handleInputChange}
              />
            </FloatingLabel>
          </>

          <fieldset
            name='assignedResources'
            class='d-flex flex-column flex-wrap m-2'
            onChange={handleChange2}
          >
            <legend>Choose Assigned Resources Names:</legend>

            {personName.map((name) => (
              <div key={name._id}>
                <input
                  type='checkbox'
                  value={name._id}
                  onClick={handleChange2}
                  // onClick={(e) => console.log(e)}
                />
                <label>
                  {name.personName}
                  {name.availability}
                </label>
              </div>
            ))}
          </fieldset>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='primary' onClick={handleProjectData}>
            Save your new project{' '}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
