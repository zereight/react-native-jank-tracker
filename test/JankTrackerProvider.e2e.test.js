import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { render } from '@testing-library/react-native';
import JankTrackerProvider from '../src/JankTrackerProvider';
import { JankContext } from '../src/JankContext';
describe('JankTrackerProvider (e2e smoke)', () => {
    it('Provider가 정상적으로 마운트된다', () => {
        const TestComponent = () => {
            const ctx = React.useContext(JankContext);
            return _jsx(_Fragment, { children: ctx ? 'OK' : 'FAIL' });
        };
        const { getByText } = render(_jsx(JankTrackerProvider, { children: _jsx(TestComponent, {}) }));
        expect(getByText('OK')).toBeTruthy();
    });
});
