

import React from 'react'
import { connect } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { selectAuthLoading, selectSendActivationCodeLoading } from '../../../redux/loading.slice'
import { activateAccountWithCode, selectCurrentUser, selectCurrentUserShouldBeActivated, sendActivationCode } from '../../../redux/user/user.slice'
import DivWithSpinner from '../../layout/DivWithSpinner'

const ActivationPage = ({sendCode, activateWithCode, loading, sendCodeLoading, shouldBeActivated, currentUser}) => {
	return (
		shouldBeActivated
		?
			<DivWithSpinner isLoading={loading.isLoading}>
				Please activate yourself
				<form onSubmit={(event) => {
					event.target.code.value.length == 6 && activateWithCode(event.target.code.value)
				}}>
					<input type="number" name="code" />
					<input type="submit" value='Activate'/>
				</form>
				<p>{loading.message}</p>
				<button onClick={sendCode}>Send activation code to email</button>
				<DivWithSpinner isLoading={sendCodeLoading.isLoading}>
					{sendCodeLoading.message}
				</DivWithSpinner>
			</DivWithSpinner>
		:
			<Navigate to={'/profile/' + currentUser._id} />
	)
}

const mapStateToProps = (state) => ({
	loading: selectAuthLoading(state),
	sendCodeLoading: selectSendActivationCodeLoading(state),
	shouldBeActivated: selectCurrentUserShouldBeActivated(state),
	currentUser: selectCurrentUser(state)
})

const mapDispatchToProps = (dispatch) => ({
	sendCode: () => dispatch(sendActivationCode()),
	activateWithCode: (code) => dispatch(activateAccountWithCode(code))
})

export default connect(mapStateToProps, mapDispatchToProps)(ActivationPage)


