import { Button, Typography, Rating, Popover, TextareaAutosize, Grid2 as Grid, TextField, CircularProgress } from "@mui/material"
import { useFormik } from "formik"
import { Edit } from "lucide-react"
import { useEffect, useState } from "react"
import * as Yup from 'yup'
import useAuthStore from "../store/AuthStore"

type AddEditReviewProps = {
    review?: {
        id: string
        rating: number
        reviewText: string
        bookTitle: string
        bookAuthor: string
    } 
    onSave: (values: Partial<AddEditReviewProps['review']>) => Promise<void>
}


export default function AddEditReview({ review, onSave }: AddEditReviewProps) {
    const { jwtUser } = useAuthStore()
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

    const commentForm = useFormik({
        initialValues: {
            rating: review?.rating || 0,
            reviewText: review?.reviewText || '',
            bookTitle: review?.bookTitle || '',
            bookAuthor: review?.bookAuthor || ''
        },
        onSubmit: async (values) => {
            await onSave(values)
            setAnchorEl(null)
        },
        validationSchema: Yup.object().shape({
            rating: Yup.number().required('Rating is required'),
            reviewText: Yup.string().trim()
                .min(20, 'Comment length should be at least 20')
                .required('Comment is required'),
            bookTitle: Yup.string().trim().required('Book title is required'),
            bookAuthor: Yup.string().trim().required('Book author is required')
        })
    })

    useEffect(
        () => {
            return () => {
                commentForm.resetForm()
                commentForm.setErrors({})
            }
        },
        []
    )

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined

    if(!jwtUser) {
        return null
    }
    
    return (
        <Grid>
            <Button
                aria-describedby={id}
                onClick={handleClick}
            >
                { review ? <Edit size={16} /> : 'Add Review' }
            </Button>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                slotProps={{
                    paper: {
                        sx: {
                            padding: 2,
                            gap: 2,
                            display: 'flex',
                            flexDirection: 'column',
                        }
                    }
                }}
            >
                <Typography
                    variant="h6"
                    textAlign='center'
                >
                    { review ? 'Edit Review' : 'Add A Review' }
                </Typography>
                <Grid
                    display='flex'
                    flexDirection='column'
                    gap={1}
                >
                    <Typography
                        variant='subtitle2'
                        component='legend'
                    >
                        Book Title
                    </Typography>
                    <TextField
                        name='bookTitle'
                        value={commentForm.values.bookTitle}
                        onChange={commentForm.handleChange}
                        placeholder='Enter the book title'
                        disabled={!!review}
                        slotProps={{ input: { size: 'small' } }}
                        error={!!commentForm.errors.bookTitle && commentForm.touched.bookTitle}
                        helperText={commentForm.errors.bookTitle && commentForm.touched.bookTitle && commentForm.errors.bookTitle}
                        color={commentForm.errors.bookTitle && commentForm.touched.bookTitle ? 'error' : 'primary'}
                    />
                </Grid>
                <Grid
                    display='flex'
                    flexDirection='column'
                    gap={1}
                >
                    <Typography
                        variant='subtitle2'
                        component='legend'
                    >
                        Book Author
                    </Typography>
                    <TextField
                        name='bookAuthor'
                        value={commentForm.values.bookAuthor}
                        onChange={commentForm.handleChange}
                        disabled={!!review}
                        placeholder='Enter the book author'
                        slotProps={{ input: { size: 'small' } }}
                        error={!!commentForm.errors.bookAuthor && commentForm.touched.bookAuthor}
                        helperText={commentForm.errors.bookAuthor && commentForm.touched.bookAuthor && commentForm.errors.bookAuthor}
                        color={commentForm.errors.bookAuthor && commentForm.touched.bookAuthor ? 'error' : 'primary'}
                    />
                </Grid>
                <Grid
                    display='flex'
                    flexDirection='column'
                    gap={1}
                >
                    <Typography
                        variant='subtitle2'
                        component='legend'
                    >
                        Comment
                    </Typography>
                    <TextareaAutosize
                        name='reviewText'
                        placeholder='Write your review here'
                        value={commentForm.values.reviewText}
                        onChange={commentForm.handleChange}
                        onBlur={commentForm.handleBlur}
                        style={{ width: '20rem', height: '5rem', padding: 1 }}
                    />
                    {
                        commentForm.errors.reviewText && commentForm.touched.reviewText && (
                            <Typography
                                color='error'
                                variant='caption'
                            >
                                {commentForm.errors.reviewText}
                            </Typography>
                        )
                    }
                </Grid>

                <Grid
                    display='flex'
                    flexDirection='column'
                    gap={1}
                >
                    <Typography
                        variant='subtitle2'
                        component='legend'
                    >
                        Rating
                    </Typography>
                    <Rating
                        name='rating'
                        value={commentForm.values.rating}
                        onChange={(_, newValue) => {
                            commentForm.setFieldValue('rating', newValue)
                        }}
                    />
                    {
                        commentForm.errors.rating && commentForm.touched.rating && (
                            <Typography
                                color='error'
                                variant='caption'
                            >
                                {commentForm.errors.rating}
                            </Typography>
                        )
                    }
                </Grid>

                <Button
                    onClick={commentForm.submitForm}
                    disabled={!commentForm.isValid || commentForm.isSubmitting}
                    variant='contained'
                >
                    { commentForm.isSubmitting  && <CircularProgress size={16} /> }
                    Save
                </Button>
            </Popover>
    </Grid>
    )
}