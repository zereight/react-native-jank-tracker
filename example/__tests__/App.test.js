import { jsx as _jsx } from "react/jsx-runtime";
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
test('renders correctly', async () => {
    await ReactTestRenderer.act(() => {
        ReactTestRenderer.create(_jsx(App, {}));
    });
});
