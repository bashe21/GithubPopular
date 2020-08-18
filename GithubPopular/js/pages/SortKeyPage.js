import React from 'react';
import {ScrollView, StyleSheet, Dimensions, Text, Alert, View} from 'react-native';
import LanguageDao,{FLAG_LANGUAGE} from '../dao/LanguageDao';
import NavigatorBar from '../public/NavigatorBar';
import SafeAreaViewPlus from '../public/SafeAreaViewPlus';
import ViewUtils from '../utils/ViewUtils';
import {DragSortableView} from 'react-native-drag-sort';
import BackPressComponent from './BackPressComponent';
import actions from '../actions';
import {connect} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ArrayUtils from '../utils/ArrayUtils';
import NavigationUtils from '../utils/NavigationUtils';

const {width} = Dimensions.get('window');
const parentWidth = width;
const childrenWidth = width;
const childrenHeight = 48;

class SortKeyPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = props.route.params;
        this.theme = this.params.theme;
        this.flag = this.params.flag;
        this.languageDao = new LanguageDao(this.flag);
        this.backPress = new BackPressComponent((e) => this.onBackPress());
        this.state = {
            checkedArray: SortKeyPage.getKeys(props),
            scrollEnabled: true,
        }
    }

    componentDidMount() {
        this.backPress.componentDidMount();
        if (SortKeyPage.getKeys(this.props).length === 0) {
            let {onloadLanguage} = this.props;
            onloadLanguage(this.flag);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const checkedArray = SortKeyPage.getKeys(nextProps, prevState);
        if (checkedArray !== prevState.checkedArray) {
            return {
                checkedArray: checkedArray,
            }
        }
        return null;
    }

    static getKeys(props, state) {
        if (state && state.checkedArray && state.checkedArray.length > 0) {
            return state.checkedArray;
        }

        const flag = props.route.params.flag === FLAG_LANGUAGE.flag_language ? 'langs' : 'keys';;
        let dataArray = props.language[flag] || [];
        let keys = [];
        for (let i=0; i<dataArray.length;i++) {
            let data = dataArray[i];
            if (data.checked) keys.push(data);
        }
        return keys;
    }

    getFlag() {
        return this.flag === FLAG_LANGUAGE.flag_language ? 'langs' : 'keys';
    }

    onBackPress() {
        this.onBack();
        return true;
    }

    onBack() {
        const {navigation} = this.props;
        if (!ArrayUtils.isEqual(SortKeyPage.getKeys(this.props), this.state.checkedArray)) {
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
                        this.onSave(true);
                    },
                }
            ]);
        } else {
            NavigationUtils.goBack(navigation);
        }
    }

    onSave(hasChecked) {
        const {navigation} = this.props;
        if (!hasChecked) {
            if (ArrayUtils.isEqual(SortKeyPage.getKeys(this.props), this.state.checkedArray)) {
                NavigationUtils.goBack(navigation);
                return;
            }
        }
        const resultArray = this.getSortResult();
        this.languageDao.save(resultArray);
        const {onloadLanguage} = this.props;
        onloadLanguage(this.flag);
        NavigationUtils.goBack(navigation);
    }

    getSortResult() {
        let flag = this.getFlag();
        let sortResultArray = ArrayUtils.clone(this.props.language[flag]);
        // 获取排序之前的排序顺序
        let originalArray = SortKeyPage.getKeys(this.props);
        for (let i = 0; i < originalArray.length; i++) {
            let item = originalArray[i];
            let index = this.props.language[flag].indexOf(item);
            sortResultArray.splice(index, 1, this.state.checkedArray[i]);
        }
        return sortResultArray;
    }

    renderItem(item) {
        return (
            <View style={item.checked ? styles.item : styles.hidden}>
                <View style={styles.item_children}>
                    <MaterialCommunityIcons 
                        name={'sort'}
                        size={16}
                        style={{marginLeft: 10, marginRight: 10}}
                    />
                    <Text>{item.name}</Text>
                </View>
            </View>
        );
    }

    render() {
        let title = this.flag == FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序';
        let navigator = <NavigatorBar 
            title={title}
            leftButton={ViewUtils.getLeftBackButton(() => this.onBack())}
            rightButton={ViewUtils.getRightButton('保存', () => this.onSave())}
            style={this.theme.styles.navBar}
        />;

        return (<SafeAreaViewPlus topColor={this.theme.themeColor}>
            {navigator}
            <ScrollView
                ref={(scrollView => this.scrollView = scrollView)}
                scrollEnabled={this.state.scrollEnabled}
                style={styles.container}
            >
                <DragSortableView 
                    dataSource={this.state.checkedArray}
                    parentWidth={parentWidth}
                    childrenWidth={childrenWidth}
                    childrenHeight={childrenHeight}
                    keyExtractor={(item) => item.name}
                    renderItem={(item) => this.renderItem(item)}
                    onDragStart={(startIndex) => {
                        this.setState({
                            scrollEnabled: false,
                        });
                    }}
                    onDragEnd={(startIndex, endIndex) => {
                        this.setState({
                            scrollEnabled: true,
                        });
                        this.state.checkedArray.splice(endIndex, 0, this.state.checkedArray.splice(startIndex, 1)[0]);
                    }}
                    onDataChange={data => {
                        if (data.length !== this.state.checkedArray.length) {
                            this.setState({
                                checkedArray: data,
                            })
                        }
                    }}
                />
            </ScrollView>
        </SafeAreaViewPlus>);
    }
}

const mapStateToProps = state => ({
    language: state.language,
});

const mapDispatchToProps = dispatch => ({
    onloadLanguage: (flag) => dispatch(actions.onloadLanguage(flag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SortKeyPage);

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#f0f0f0',
    },
    line: {
        flex: 1, 
        height: 0.3,
        backgroundColor: 'darkgray',
    },
    item: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        borderBottomColor: 1,
        borderColor: '#eee',
        height: 50,
        justifyContent: 'center',
        width: childrenWidth,
        height: childrenHeight,
        alignItems: 'center',
    },
    hidden: {
        height: 0,
    },
    item_children: {
        height: childrenHeight-4,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginLeft: 10,
        marginRight: 10,
        width: childrenWidth,
    },
})