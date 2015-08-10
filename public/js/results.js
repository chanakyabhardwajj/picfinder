'use strict';

function sendText(text) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/picfinder?text=' + text);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            if (xhr.status == 200) {
                resolve(xhr.responseText);
            } else {
                reject(Error(xhr.responseText));
            }
        };

        xhr.onerror = function () {
            reject(Error("Network Error"));
        };

        xhr.send();
    });
}

var PictureCard = React.createClass({
    displayName: 'PictureCard',

    render: function render() {
        var style = {
            backgroundImage: 'url(' + this.props.picture.imageLink + ')'
        };

        return React.createElement(
            'div',
            { className: "PictureCard" },
            React.createElement('a', { href: this.props.picture.link, target: "_blank", className: "Picture", style: style }),
            React.createElement(
                'small',
                { className: "PictureDesc" },
                this.props.picture.source
            )
        );
    }
});

var KeySection = React.createClass({
    displayName: 'KeySection',

    getInitialState: function getInitialState() {
        return {
            imagesShown: this.props.first ? true : false
        };
    },
    toggleImages: function toggleImages() {
        var imagesShown = this.state.imagesShown;
        this.setState({
            imagesShown: !imagesShown
        });
    },
    render: function render() {
        var style = {
            display: this.state.imagesShown ? "flex" : "none"
        };
        var keyword = this.props.data.keyword;
        var hint = this.state.imagesShown ? "hide" : "show";
        var pictureCards = this.props.data.pictures.map(function (picture) {
            return React.createElement(PictureCard, { picture: picture });
        });
        return React.createElement(
            'div',
            { className: "KeySection" },
            React.createElement(
                'h3',
                { className: "Keyword", onClick: this.toggleImages },
                keyword,
                ' ',
                React.createElement(
                    'small',
                    null,
                    hint
                )
            ),
            React.createElement(
                'div',
                { style: style, className: "PictureBox" },
                pictureCards
            )
        );
    }
});

var ResultSection = React.createClass({
    displayName: 'ResultSection',

    render: function render() {
        if (this.props.failure) {
            return React.createElement(
                'p',
                null,
                this.props.message
            );
        } else {
            var content;
            if (this.props.data.length === 0) {
                return React.createElement(
                    'section',
                    { className: "ResultSection" },
                    'Oops. Couldn\'t find any relevant images.'
                );
            }
            content = this.props.data.map(function (item, index) {
                return React.createElement(KeySection, { data: item, first: index === 0 });
            });

            return React.createElement(
                'section',
                { className: "ResultSection" },
                content
            );
        }
    }
});

var InputSection = React.createClass({
    displayName: 'InputSection',

    getInitialState: function getInitialState() {
        return {
            buttonLabel: "submit"
        };
    },
    handleClick: function handleClick(event) {
        var self = this,
            text = document.getElementById("text").value;

        if (text.length) {
            this.setState({
                buttonLabel: "hang on"
            });

            sendText(text).then(function (response) {
                React.render(React.createElement(ResultSection, { data: JSON.parse(response).data }), document.getElementById("resultSection"));
                self.setState({
                    buttonLabel: "submit"
                });
            })['catch'](function (error) {
                React.render(React.createElement(ResultSection, { failure: true, message: error.message }), document.getElementById("resultSection"));
                self.setState({
                    buttonLabel: "submit"
                });
            });
        } else {
            React.render(React.createElement(ResultSection, { failure: true, message: "You have not provided a link" }), document.getElementById("resultSection"));
        }
    },
    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement('input', { type: "text", id: "text", name: "text", defaultValue: "https://medium.com/@tdoria/meditation-for-dummies-4d9cd7b366d4", placeholder: "paste a link..." }),
            React.createElement('input', { id: "submitButton", type: "button", value: this.state.buttonLabel, onClick: this.handleClick })
        );
    }
});

React.render(React.createElement(InputSection, null), document.getElementById("inputSection"));