import React from 'react';
import { useGetList } from 'react-admin';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  BooleanField,
  NumberField,
} from 'react-admin';

const ProjectList = (props) => {
  const { data } = useGetList('projects', {
    pagination: { page: 1, perPage: 10 },
  });
  console.log(data);
  return (
    <List {...props}>
      <Datagrid>
        <TextField source='title' />
        <NumberField source='allocation' />
        <BooleanField source='completed' />
        <EditButton basePath='/resources' />
        <DeleteButton basePath='/resources' />
      </Datagrid>
    </List>
  );
};

export default ProjectList;
