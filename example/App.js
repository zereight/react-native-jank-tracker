import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, } from 'react-native';
import { Colors, DebugInstructions, Header, LearnMoreLinks, ReloadInstructions, } from 'react-native/Libraries/NewAppScreen';
function Section({ children, title }) {
    const isDarkMode = useColorScheme() === 'dark';
    return (_jsxs(View, { style: styles.sectionContainer, children: [_jsx(Text, { style: [
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ], children: title }), _jsx(Text, { style: [
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : Colors.dark,
                    },
                ], children: children })] }));
}
function App() {
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    /*
     * To keep the template simple and small we're adding padding to prevent view
     * from rendering under the System UI.
     * For bigger apps the recommendation is to use `react-native-safe-area-context`:
     * https://github.com/AppAndFlow/react-native-safe-area-context
     *
     * You can read more about it here:
     * https://github.com/react-native-community/discussions-and-proposals/discussions/827
     */
    const safePadding = '5%';
    return (_jsxs(View, { style: backgroundStyle, children: [_jsx(StatusBar, { barStyle: isDarkMode ? 'light-content' : 'dark-content', backgroundColor: backgroundStyle.backgroundColor }), _jsxs(ScrollView, { style: backgroundStyle, children: [_jsx(View, { style: { paddingRight: safePadding }, children: _jsx(Header, {}) }), _jsxs(View, { style: {
                            backgroundColor: isDarkMode ? Colors.black : Colors.white,
                            paddingHorizontal: safePadding,
                            paddingBottom: safePadding,
                        }, children: [_jsxs(Section, { title: "Step One", children: ["Edit ", _jsx(Text, { style: styles.highlight, children: "App.tsx" }), " to change this screen and then come back to see your edits."] }), _jsx(Section, { title: "See Your Changes", children: _jsx(ReloadInstructions, {}) }), _jsx(Section, { title: "Debug", children: _jsx(DebugInstructions, {}) }), _jsx(Section, { title: "Learn More", children: "Read the docs to discover what to do next:" }), _jsx(LearnMoreLinks, {})] })] })] }));
}
const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});
export default App;
