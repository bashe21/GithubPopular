import {StyleSheet} from 'react-native';

export const ThemeFlags = {
    Default: '#2196f3',
    Red: '#f44336',
    Pink: '#391e63',
    Purple: '#39c27b',
    DeepPurple: '#673ab7',
    Indigo: '#3f51b5',
    Blue: '#2196f3',
    LightBlue: '#03a9f4',
    Cyan: '#00bcd4',
    Teal: '#009677',
    Green: '#4caf50',
    LightGreen: '#8bc34a',
    Lime: '#cddc39',
    Yellow: '#ffeb3b',
    Amber: '#ffc107',
    Orange: '#ff9800',
    DeepOrange: '#ff5722',
    Brown: '#795548',
    Grey: '#9e9e9e',
    BlueGrey: '#607d88',
    Black: '#000000',
}

export default class ThemeFactory {
    /* 
    创建一个主题样式
    @params themeflag 主题标识
    @returns
    */
   static createTheme(themeFlag) {
       return {
           themeColor: themeFlag,
           styles: StyleSheet.create({
               selectedTitlesStyles: {
                   color: themeFlag,
               },
               tabBarSelectedIcon: {
                   tintColor: themeFlag,
               },
               navBar: {
                   backgroundColor: themeFlag,
               }
           })
       }
   }
}