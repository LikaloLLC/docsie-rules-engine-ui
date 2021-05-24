import React, {Fragment, useState} from 'react';
import {JsonForms} from '@jsonforms/react';
import {TextareaAutosize} from "@material-ui/core";
import {materialCells, materialRenderers,} from '@jsonforms/material-renderers';
import uischema from './schemas/uischema.json'
import schema from './schemas/schema.json'

import notificationSchema from './schemas/actions/schema.json'
import dbSchema from './schemas/data_sources/db/schema.json'

import {createAjv} from "@jsonforms/core";

const initialData = {}
const ajv = createAjv();
ajv.addSchema(schema);
ajv.addSchema(notificationSchema, 'notification');
ajv.addSchema(dbSchema, 'db');

const notificationResolver = {
    order: 1,
    canRead: function(file) {
        return file.url.indexOf('notification') !== -1;
    },
    read: function() {
        return JSON.stringify(notificationSchema);
    },
};

const dbResolver = {
    order: 2,
    canRead: function(file) {
        return file.url.indexOf('db') !== -1;
    },
    read: function() {
        return JSON.stringify(dbSchema);
    },
};

const refParserOptions = {
    resolve: {
        notification: notificationResolver,
        db: dbResolver
    },
};

const App = () => {
    const [stateData, setData] = useState(initialData)

    return (
        <Fragment>
            <JsonForms
                schema={schema}
                uischema={uischema}
                data={initialData}
                renderers={materialRenderers}
                cells={materialCells}
                ajv={ajv}
                refParserOptions={refParserOptions}
                onChange={({errors, data}) => setData(data)}
            />
            <TextareaAutosize
                placeholder="Rules"
                value={JSON.stringify(stateData, null, 2)}
            />
        </Fragment>
    );
}

export default App;