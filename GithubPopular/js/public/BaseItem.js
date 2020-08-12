import React from 'react';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class BaseItem extends React.Component {
    constructor(props) {
        super(props);
        let isFavorite = props.projectModel.isFavorite;
        this.state = {
            isFavorite: isFavorite,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const isFavorite = nextProps.projectModel.isFavorite;
        if (prevState.isFavorite != isFavorite) {
            return {
                isFavorite: isFavorite,
            };
        }
        return null;
    }

    // componentWillReceiveProps(nextProps) {
    //     if (this.props.projectModel.isFavorite != nextProps.projectModel.isFavorite) {
    //         this.setState({
    //             isFavorite: isFavorite,
    //         });
    //     }
    // }

    setFavoriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite,
        });
    }

    onItemClick() {
        this.props.onSelect((isFavorite) => {
            this.setState({
                isFavorite: isFavorite,
            });
        });
    }

    onPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite);
        this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite);
    }

    favoriteIcon() {
        return (
            <TouchableOpacity
                style={{padding: 5}}
                underlayColor="transparent"
                onPress={() => {
                    this.onPressFavorite();
                }}
            >
                <FontAwesome 
                    name={this.state.isFavorite ? 'star' : 'star-o'}
                    size={26}
                    style={{color: '#678'}}
                />
            </TouchableOpacity>
        );
    }

}

BaseItem.proptypes = {
    projectModel: PropTypes.object,
    onSelect: PropTypes.func,
    onFavorite: PropTypes.func,
}