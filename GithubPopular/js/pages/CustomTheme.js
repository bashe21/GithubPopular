import React from 'react';
import {Modal, ScrollView, TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import ThemeDao from '../dao/ThemeDao';
import ThemeFactory, { ThemeFlags } from '../res/styles/ThemeFactory';
import actions from '../actions';

class CustomTheme extends React.Component {
    constructor(props) {
        super(props);
        this.themeDao = new ThemeDao();
    }

    onSelectedItem(themeKey) {
        this.props.onClose();
        this.themeDao.save(ThemeFlags[themeKey]);
        const {onThemeChange} = this.props;
        onThemeChange(ThemeFactory.createTheme(ThemeFlags[themeKey]));
    }

    renderThemeItem(themeKey) {
        return (
            <TouchableOpacity
                style={{flex: 1}}
                underlayColor='white'
                onPress={() => this.onSelectedItem(themeKey)}
            >

                <View style={[{backgroundColor: ThemeFlags[themeKey]}, styles.themeItem]}>
                    <Text style={styles.themeText}>{themeKey}</Text>
                </View>

            </TouchableOpacity>
        );
    }

    renderThemeItems() {
        let views = [];
        for (let i = 0, keys = Object.keys(ThemeFlags); i < keys.length; i+=3) {
            const key1 = keys[i], key2 = keys[i+1], key3 = keys[i+2];
            views.push(
                <View key={i} style={{flexDirection: 'row'}}>
                    {this.renderThemeItem(key1)}
                    {this.renderThemeItem(key2)}
                    {this.renderThemeItem(key3)}
                </View>
            );
        }
        return views;
    }

    renderContentView() {
        return <Modal
            animated={'silde'}
            transparent={true}
            visible={this.props.visible}
            onRequestClose={() => this.props.onClose()}
        >
            <ScrollView>
                {this.renderThemeItems()}
            </ScrollView>
        </Modal>
    }

    render() {
        let view = this.props.visible ? <View>
                {this.renderContentView()}
            </View> : null;
        return view;
    }
}

const mapDiapatchToProps = dispatch => ({
    onThemeChange: (theme) => dispatch(actions.onThemeChange(theme)),
});

export default connect(null, mapDiapatchToProps)(CustomTheme);


const styles = StyleSheet.create({
    modalContainer: {
        flex: 1, 
        margin: 10,
        marginTop: Platform.OS === 'ios' ? 20 : 10,
        backgroundColor: 'white',
        borderRadius: 3,
        shadowColor: 'gray',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        padding: 3,
    },

    themeItem: {
        flex: 1, 
        height: 120, 
        margin: 3, 
        padding: 3,
        borderRadius: 2, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    themeText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16,
    }
})