import React from 'react';
import {ScrollView, StyleSheet, Alert, View} from 'react-native';
import LanguageDao,{FLAG_LANGUAGE} from '../dao/LanguageDao';
import NavigatorBar from '../public/NavigatorBar';
import SafeAreaViewPlus from '../public/SafeAreaViewPlus';
import ViewUtils from '../utils/ViewUtils';
import CheckBox from 'react-native-check-box';
import BackPressComponent from './BackPressComponent';
import actions from '../actions';
import {connect} from 'react-redux';
import ArrayUtils from '../utils/ArrayUtils';
import NavigationUtils from '../utils/NavigationUtils';

class CustomKeyPage extends React.Component {
    constructor(props) {
        super(props);
        this.flag = props.route.params.flag;
        this.isRemoveKey = props.route.params.isRemoveKey;
        this.languageDao = new LanguageDao(this.flag);
        this.backPress = new BackPressComponent(e => this.onBackPress(e));
        this.changeValues = [];
        this.state = {
            keys: [],
        };
    }

    componentDidMount() {
        const {onloadLanguage} = this.props;
        onloadLanguage(this.flag);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.keys != CustomKeyPage._keys(nextProps, null, prevState)) {
            return {
                keys: CustomKeyPage._keys(nextProps, null, prevState),
            };
        }
        return null;
    }

    onBackPress(e) {
        this.onBack();
        return true;
    }

    onBack() {
        const {navigation} = this.props;
        if (this.changeValues.length > 0) {
            Alert.alert('提示', '要保存修改吗?', [
                {
                    text: '否',
                    onPress: () => {
                        NavigationUtils.goBack(navigation);
                    },
                },
                {
                    text: '是',
                    onPress: () => {
                        this.onSave();
                    }
                }
            ]) 
        } else {
            NavigationUtils.goBack(navigation);
        }
    }

    onSave() {
        const {navigation, onloadLanguage} = this.props;
        if (this.changeValues.length === 0) {
            NavigationUtils.goBack(navigation);
            return;
        }
        let keys;
        if (this.isRemoveKey) {
            for (let i = 0; i < this.changeValues.length; i++) {
                ArrayUtils.remove(keys = CustomKeyPage._keys(this.props, true), this.changeValues[i], 'name');
            }
        }
        this.languageDao.save(keys || this.state.keys);
        onloadLanguage(this.flag);
        NavigationUtils.goBack(navigation);
    }

    static _keys(props, original, state) {
        const {flag, isRemoveKey} = props.route.params;
        let key = flag === FLAG_LANGUAGE.flag_language ? 'langs' : 'keys';
        if (isRemoveKey && !original) {
            return (state && state.keys.length !== 0 && state.keys) || props.language[key].map(val => {
                return {
                    ...val,
                    checked: false,
                };
            });
        }
        return props.language[key];
    }

    onClick(data, index) {
        data.checked = !data.checked;
        ArrayUtils.updataArray(this.changeValues, data);
        this.state.keys[index] = data;
        this.setState({
            keys: this.state.keys,
        });
    }

    _checkedImage(checked) {

    }

    renderCheckBox(data, index) {
        return <CheckBox 
                    style={{flex: 1, padding: 10}}
                    onClick={()=>this.onClick(data, index)}
                    isChecked={data.checked}
                    leftText={data.name}
                    checkedImage = {this._checkedImage(true)}
                    unCheckedImage = {this._checkedImage(false)}
               />;
    }

    renderView() {
        let dataArray = this.state.keys;
        if (!dataArray || !dataArray.length === 0) return;
        let len = dataArray.length;
        let views = [];
        for (let i = 0; i < len; i+=2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(dataArray[i], i)}
                        {i+1 < len && this.renderCheckBox(dataArray[i+1], i+1)}
                    </View>
                    <View  style={styles.line}/>
                </View>
            );
        }
        return views;
    }

    render() {
        let title = this.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : (this.isRemoveKey ? '标签移除' : '自定义标签');
        let rightButtonTitle = this.isRemoveKey ? '移除' : '保存';
        let navigator = <NavigatorBar 
            title={title}
            leftButton={ViewUtils.getLeftBackButton(() => this.onBack())}
            rightButton={ViewUtils.getRightButton(rightButtonTitle, () => this.onSave())}
        />
        return (
            <SafeAreaViewPlus>
                {navigator}
                <ScrollView>
                    {this.renderView()}
                </ScrollView>
            </SafeAreaViewPlus>
        );
    }
}

const mapStateToProps = state => ({
    language: state.language,
});

const mapDispatchToProps = distpach => ({
    onloadLanguage: (flag) => distpach(actions.onloadLanguage(flag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomKeyPage);

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    },
    item: {
        flexDirection: 'row',
    },
    line: {
        flex: 1, 
        height: 0.3,
        backgroundColor: 'darkgray',
    }
});