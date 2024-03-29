import styles from './Post.module.sass'

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import emptyPostImage from '../../../../assets/img/empty-white-letterboard.png'
import baseUrl from '../../../../api/baseUrl'
import { selectCurrentUser, selectCurrentUserShouldBeActivated, selectUserById } from '../../../../redux/user/user.slice'
import { Link, useNavigate } from 'react-router-dom'
import { deletePost, likePost, removeLike } from '../../../../redux/post/post.slice'
import emptyAvatar from '../../../../assets/img/empty-avatar.jpg'
import { selectAuthLoading } from '../../../../redux/loading.slice'

const Post = ({ isAuthenticated, deletePost, shouldBeActivated, post: {
	website,
	tags,
	linkPreview: {
		title,
		siteName,
		description,
		imageUrl,
		screenshotFileId,
	} = {},
	date,
	author,
	likedBy = [],
	_id
}, currentUser, like, removeLike }) => {
	const navigate = useNavigate()
	//to short text if too long
	const descriptionLimit = 100
	const titleLimit = 70
	const siteNameLimit = 70
	const urlLimit = 30
	const newTabWithPostWebsite = () => {
		window.open(website)
	}

	return (
		<div className={styles.container} key={_id}>
			<Link to={`/profile/${author._id}`}>
				<div className={styles.top}>
					<img src={author.avatar ? `${baseUrl}/image/${author.avatar}` : emptyAvatar} alt="avatar" className={styles.avatar} />
					<div className={styles.rightText}>
						<div className={styles.authorName}>{author.name}</div>
						<div className={styles.authorTitle}>{author.title}</div>
					</div>

					<div className={styles.dateCreated}>{new Date(date).toLocaleDateString()}</div>
				</div>
			</Link>

			<div className={styles.textBlock}>
				{/* metadata can contain some html syntax */}
				<div className={styles.siteName} dangerouslySetInnerHTML={{ __html: siteName ? (siteName?.length <= siteNameLimit ? siteName : siteName?.substring(0, siteNameLimit) + '...') : '' }}></div>
				<div className={styles.title} dangerouslySetInnerHTML={{ __html: title ? (title?.length <= titleLimit ? title : title?.substring(0, titleLimit) + '...') : ''}}></div>
				<div className={styles.description} dangerouslySetInnerHTML={{ __html: description ? (description?.length <= descriptionLimit ? description : description?.substring(0, descriptionLimit) + '...') : '' }}></div>
			</div>

			<div className={styles.bottomBlock}>
				<img
					onClick={newTabWithPostWebsite}
					src={imageUrl || (screenshotFileId && `${baseUrl}/image/${screenshotFileId}`) || emptyPostImage} alt="post"
					className={styles.postImage}
				/>



				{/* <p>tags: {tags.map((tag, index, array) => index < array.length - 1 ? `${tag}, ` : tag)}</p> */}
				<div
					className={styles.websiteUrlContainer}
					onClick={newTabWithPostWebsite}
				>
					<div className={styles.websiteUrl}>{website.length <= urlLimit ? website : website?.substring(0, urlLimit) + '...'}</div>
					<hr />
				</div>
				<div className={styles.bottom}>
					<div className={styles.deletePostWrapper}></div>
					{
						((currentUser._id === author._id) || currentUser.isAdmin) && 
						<button className={styles.deletePost} onClick={() => deletePost(_id)}></button>
					}
					
					<div className={styles.likesContainer}>
						<i
							className={`${styles.likeButton} ${likedBy.some(id => id == currentUser?._id) ? styles.liked : ''}`}
							onClick={() => {
								if (!isAuthenticated) return navigate('/register')
								if (shouldBeActivated) return navigate('/activate-with-code')
								if (likedBy.some(id => id == currentUser?._id)) {
									removeLike()
								} else {
									like()
								}
							}}
						></i>
						<p className={styles.likeCount}>{likedBy.length}</p>
						{/* <span className={likedBy.some(id => id == currentUser?._id) ? styles.liked : ''}>Liked!</span> */}
					</div>
				</div>

			</div>

		</div>
	)
}

const mapStateToProps = (state, ownProps) => ({
	currentUser: selectCurrentUser(state),
	post: { ...ownProps.post, author: selectUserById(ownProps.post.author)(state) },
	isAuthenticated: selectAuthLoading(state).success,
	shouldBeActivated: selectCurrentUserShouldBeActivated(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	like: () => { console.log(ownProps); return dispatch(likePost(ownProps.post._id)) },
	removeLike: () => dispatch(removeLike(ownProps.post._id)),
	deletePost: (postId) => dispatch(deletePost(postId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Post)


