import React from 'react';
import { withTranslation } from 'react-i18next';
import i18n from './i18n';
import config from './config.js';
import './App.scss'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      notes:[],
    };
  }

  async componentDidMount() {
    let allNotes = await this.fetchAllNotes();
    this.setState({notes: allNotes});
  }

  async fetchAllNotes(){
    let response = await fetch(config.API_address+'/notes');
    if(response.ok){
      let json = await response.json();
      return json; 
    }else{
      console.log(response.status);
      return null;
    }
  }

  async listUpdate(){
    let allNotes = await this.fetchAllNotes();
    this.setState({notes: allNotes});
  }

  render(){
    return(
        <div className="App">
          <AppHeaderWithTranslation listUpdate={this.listUpdate.bind(this)} />
          <NoteList listUpdate={this.listUpdate.bind(this)} notes={this.state.notes} />
        </div>
    )
  };
}

export default App;

function LanguageSelector(props){
  return(
    <select onChange={props.changeHandler} 
      defaultValue={props.currentLanguage}
    >
      <option value="en">en</option>
      <option value="ru">ru</option>
      <option value="ua">ua</option>
    </select>
  );
}

class AppHeader extends React.Component{

  constructor(props){
    super(props);
    this.listUpdate=props.listUpdate;
    this.state={
      input:'', 
      inputNote:false,
      language: i18n.language,
    }
    this.handleLanguageChange = event => {
      let newlang = event.target.value;
      this.setState({ language: newlang });
      i18n.changeLanguage(newlang);
    }
  }

  async postNote(note){
    let data={id:null, note:note};
    let response = await fetch(config.API_address+'/notes',{
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body:JSON.stringify(data)
    });
    let result = await response.json();
    if(response.status!==200){
      throw new Error(result.message);
    }
    return result;
  }

  handleInputChange(e) {
    this.setState({input: e.target.value});
    e.target.style.height = "1px";
    e.target.style.height = e.target.scrollHeight+"px";
  }

  render(){
    const { t } = this.props;

    let inputComponent;
    if(this.state.inputNote){
      inputComponent = 
      <div className="note">
        <textarea onChange={
          this.handleInputChange.bind(this)
        }></textarea>
        <button onClick={()=>{
          this.setState({inputNote:!this.state.inputNote});
          this.postNote(this.state.input)
          .then((result)=>{
            //console.log(result);
            this.setState({input:''});
            this.listUpdate();
          })
          .catch(error=>console.log(error));
        }}>{t('Accept')}</button>
        <button onClick={()=>{this.setState({inputNote:!this.state.inputNote});}}>{t('Cancel')}</button>
      </div>
    }
    return (
      <div>
        <div className="appHeader">
          <div className="title">
            <h3>{t('Test project by Dmytro Hryshchenko')}</h3>
          </div>
          <div className="headerMenu">
            <div className="container header">
              <button onClick={()=>{this.setState({inputNote:!this.state.inputNote});}} disabled={this.state.inputNote}>{t('Add Note')}</button>
            </div>
            <div className="container header">
              <LanguageSelector
                changeHandler={this.handleLanguageChange.bind(this)}
                currentLanguage={this.state.language}
              />
            </div>
          </div>
        </div>
        <div>{inputComponent}</div>
      </div>
    )
  }
}

const AppHeaderWithTranslation = withTranslation()(AppHeader);

function NoteList(props){
  let listNotes = props.notes.map((elem) =>
    <NoteWithTranslation listUpdate={props.listUpdate} key={elem.id} elemId={elem.id} noteText={elem.note} />
  );
  return(
    <div className="noteList">
      <ul>{listNotes}</ul>
    </div>
  )
}

class Note extends React.Component{
  constructor(props){
    super(props);
    this.listUpdate=props.listUpdate;
    this.state={
      id:props.elemId, 
      edit:false, 
      noteText:props.noteText, 
      noteNewText:props.noteText
    }
  }

  async putNote(id,note){
    let data={note:note};
    let response = await fetch(config.API_address+'/notes/'+id,{
      method: 'PUT',
      headers: {
        'Content-Type':'application/json'
      },
      body:JSON.stringify(data)
    });
    let result = await response.json();
    if(response.status!==200){
      throw new Error(result.message);
    }
    return result;
  }

  async deleteNote(id){
    let response = await fetch(config.API_address+'/notes/'+id,{
      method: 'DELETE',
      headers: {
        'Content-Type':'application/json'
      },
      body:JSON.stringify({id:id})
    });
    let result = await response.json();
    if(response.status!==200){
      throw new Error(result.message);
    }
    return result;
  }

  render(){
    const { t } = this.props;
    let noteMode = <div className="note">
      <div className="noteText">{this.state.noteNewText}</div>
      <div className="noteMenu">
        <div className="container noteButton"
          onClick={(e)=>{
            this.setState({edit:true});
          }}>{t('Edit')}
        </div>
        <div className='container noteButton' 
        onClick={()=>{
          this.deleteNote(this.state.id)
          .then(()=>{
            this.listUpdate();
          })
          .catch(error=>console.log(error));
        }}>{t('Delete')}</div>
      </div>
    </div>
    if(this.state.edit)
      noteMode = 
      <div className="note">
        <textarea id="editInput" className="textarea"
          onFocus={(e)=>{
            e.target.style.height = "1px";
            e.target.style.height = e.target.scrollHeight+"px";
          }}
          onChange={(e)=>{
            e.target.style.height = "1px";
            e.target.style.height = e.target.scrollHeight+"px";
            this.setState({noteNewText:e.target.value});
          }}
          defaultValue={this.state.noteText}
        ></textarea>
        <button onClick={()=>{
          this.setState({edit:false});
          this.putNote(this.state.id, this.state.noteNewText)
          .then(result=>{
            this.setState({noteText:this.state.noteNewText});
          })
          .catch(error=>console.log(error));
        }}>{t('Accept')}</button>
        <button onClick={()=>{this.setState({edit:false, noteNewText:this.state.noteText});}}>{t('Cancel')}</button>
      </div>
    return(
      <li>
        {noteMode}
      </li>
    );
  }
}

const NoteWithTranslation = withTranslation()(Note);