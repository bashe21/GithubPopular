import React from 'react';
import {View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import BaseItem from '../public/BaseItem';

export default class TrendingItem extends BaseItem {
    render() {
        const {projectModel} = this.props;
        const {item} = projectModel;
        if (!item) return null;

        return (
            <TouchableOpacity onPress={() => this.onItemClick()}>
                <View style={styles.container}>
                    <Text style={styles.title}>{item.repo}</Text>
                    <Text style={styles.description}>{item.desc}</Text>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Text>build by:</Text>
                            {item.avatars.map((result, i) => {
                                <Image 
                                key={result}
                                source={{uri: result}}
                                style={{width: 20, height: 20, margin: 2}}
                            />
                            })}
                            
                        </View>
                        {this.favoriteIcon()}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2,
    },

    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121',
    },

    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575',
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },


});