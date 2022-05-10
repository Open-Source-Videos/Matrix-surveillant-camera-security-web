import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import Header from './components/Header/Header';
// import Footer from './components/Footer';
import Navigation from './navigation';
import { getStore } from './utils';
import { ActionCreators } from './actions/profile';
import AOS from 'aos';
import 'aos/dist/aos.css';

// import { GlobalContext, initialGlobalState} from './hooks/useMatrixClient'
import './styles';

function App() {
    //   const [state, setState] = useState({
    //     ...initialGlobalState,
    //     update,
    // });

    // function update(data) {
    //   setState(Object.assign({}, state, data));
    // }

    useEffect(() => {
        AOS.init();
        AOS.refresh();
        const user = getStore('user');
        if (user) {
            this.props.dispatch(ActionCreators.login(user));
        }
    }, []);
    return (
        <div>
            <Navigation />
        </div>
    );
}

//<GlobalContext.Provider value={state}>
//</GlobalContext.Provider>

// class App extends React.Component {
//   componentDidMount() {
//     const user = getStore('user')
//     if (user) {
//       this.props.dispatch(ActionCreators.login(user));
//     }
//   }
//   render() {
//     return (
//       <div>
//         <Navigation />
//       </div>
//     )
//   }
// }

const mapStateToProps = (state) => {
    return {
        profile: state.user.profile,
    };
};

export default connect(mapStateToProps)(App);
