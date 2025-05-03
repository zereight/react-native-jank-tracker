import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, Button } from 'react-native';
import { JankTrackerProvider, useTTIMeasure } from '../src';
const ExampleComponent = () => {
    const { tti, start, stop } = useTTIMeasure();
    const handlePress = (e) => {
        start(e?.nativeEvent?.timestamp);
        setTimeout(() => {
            stop();
        }, Math.random() * 200 + 50); // 임의의 지연 시뮬레이션
    };
    return (_jsxs(View, { style: { flex: 1, justifyContent: 'center', alignItems: 'center' }, children: [_jsx(Button, { title: "TTI \uCE21\uC815 \uBC84\uD2BC", onPress: handlePress }), _jsx(Text, { style: { marginTop: 20 }, children: tti !== null ? `TTI: ${tti.toFixed(1)}ms` : '버튼을 눌러 TTI 측정' })] }));
};
const App = () => (_jsx(JankTrackerProvider, { children: _jsx(ExampleComponent, {}) }));
export default App;
