import { Grid2 as Grid, IconButton, TextField, TextFieldProps, Typography, TypographyProps } from "@mui/material"
import { Check, Edit, X } from "lucide-react"
import { useEffect, useState } from "react"

type EditableProps = {
    text: string
    onChange: (value: string) => void
    textFieldProps?: TextFieldProps
    typographyProps?: TypographyProps
}

export default function Editable({ text, onChange, textFieldProps, typographyProps }: EditableProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(text)

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = () => {
        onChange(value)
        setIsEditing(false)
    }

    useEffect(() => {
        setValue(text)
    }, [text])

    return (
        <Grid
            display='flex'
            flexDirection='row'
            alignItems='center'
            justifyContent='center'
            sx={{
                "&:hover": {
                    "& button": {
                        visibility: 'visible'
                    }
                },
                width: '100%'
            }}
            gap={1}
        >
            {isEditing ? (
                <TextField
                    {...textFieldProps}
                    size="small"
                    variant="outlined"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    sx={{ borderRadius: '.5rem' }}
                    slotProps={{
                        input: { 
                            endAdornment: (
                                <>
                                    <Check onClick={handleSave}  style={{ height: '1.25rem', width: '1.25rem', cursor: 'pointer' }} />
                                    <X style={{ height: '1.25rem', width: '1.25rem', cursor: 'pointer' }} onClick={() => setIsEditing(false)} />
                                </>
                            )
                        }
                    }}
                />
            ) : (
                <>
                    <Typography
                        {...typographyProps}
                    >
                        {text}
                    </Typography>
                    <IconButton
                        sx={{ visibility: 'hidden' }}
                        onClick={handleEdit}
                    >
                        <Edit width='1rem' height='1rem' />
                    </IconButton>
                </>
            )}
        </Grid>
    )

}