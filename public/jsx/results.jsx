function sendText(text) {
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/picfinder?text=' + text);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function() {
            if(xhr.status == 200) {
                resolve(xhr.responseText);
            } else {
                reject(Error(xhr.responseText));
            }
        }

        xhr.onerror = function() {
            reject(Error("Network Error"));
        };

        xhr.send();
    })

}

var PictureCard = React.createClass({
    render: function(){
        var style = {
            backgroundImage: 'url(' + this.props.picture.imageLink + ')'
        }

        return (
            <div className="PictureCard">
                <a href={this.props.picture.link} target="_blank" className="Picture" style={style}></a>
                <small className="PictureDesc">{this.props.picture.source}</small>
            </div>
        )
    }
});

var KeySection = React.createClass({
    getInitialState: function() {
        return {
            imagesShown : this.props.first ? true : false
        };
    },
    toggleImages: function() {
        var imagesShown = this.state.imagesShown;
        this.setState({
            imagesShown : !imagesShown
        })
    },
    render: function() {
        var style = {
            display: this.state.imagesShown ? "flex" : "none"
        }
        var keyword = this.props.data.keyword;
        var hint = this.state.imagesShown ? "hide" : "show"
        var pictureCards = this.props.data.pictures.map(function(picture){
            return (
                <PictureCard picture={picture}></PictureCard>
            );
        })
        return (
            <div className="KeySection">
                <h3 className="Keyword" onClick={this.toggleImages}>{keyword} <small>{hint}</small></h3>
                <div style={style} className="PictureBox">{pictureCards}</div>
            </div>
        );
    }
});

var ResultSection = React.createClass({
    render: function() {
        if(this.props.failure) {
            return (
                <p>{this.props.message}</p>
            );
        } else {
            var content;
            if(this.props.data.length === 0) {
                return (
                    <section className="ResultSection">Oops. Couldn't find any relevant images.</section>
                );
            }
            content = this.props.data.map(function(item, index) {
                return (
                    <KeySection data={item} first={index===0}></KeySection>
                );
            });

            return (
                <section className="ResultSection">{content}</section>
            );
        }
    }
});

var InputSection = React.createClass({
    getInitialState: function() {
        return {
            buttonLabel : "submit"
        };
    },
    handleClick : function(event) {
        var self = this,
            text = document.getElementById("text").value;

        if(text.length) {
            this.setState({
                buttonLabel : "hang on"
            });

            sendText(text).then(function(response) {
                React.render(
                    <ResultSection data={JSON.parse(response).data}></ResultSection>, document.getElementById("resultSection")
                );
                self.setState({
                    buttonLabel : "submit"
                });
            }).catch(function(error){
                React.render(
                    <ResultSection failure={true} message={error.message}></ResultSection>, document.getElementById("resultSection")
                );
                self.setState({
                    buttonLabel : "submit"
                });
            })
        } else {
            React.render(
                <ResultSection failure={true} message="You have not provided a link"></ResultSection>, document.getElementById("resultSection")
            );
        }
    },
    render : function(){
        return (
            <div>
                <input type="text" id="text" name="text" defaultValue="https://medium.com/@tdoria/meditation-for-dummies-4d9cd7b366d4" placeholder="paste a link..."></input>
                <input id="submitButton" type="button" value={this.state.buttonLabel} onClick={this.handleClick}/>
            </div>
        );
    }
});

React.render(<InputSection />, document.getElementById("inputSection"));
