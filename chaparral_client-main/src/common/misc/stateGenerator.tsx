import { useState } from 'react';

const generateState = (arr: any[]) => {
    return arr.map((defaultValue) => {
        const [state, setState] = useState(defaultValue);
        return {
            value: state,
            set: setState,
        }
    })
};

export default generateState;