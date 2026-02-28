import { IUser } from '@/types/models/user';
import {
    Checkbox,
    FormControlLabel,
    FormGroup,
    Input,
    Select,
    MenuItem,
    SelectChangeEvent,
    CircularProgress
} from '@mui/material';


interface ClientSectionProps {
    users: IUser[];
    loading: boolean;
    error: string;
    selectedClientId: string | null;
    setSelectedClientId: React.Dispatch<React.SetStateAction<string | null>>;
}

const ClientsSection = ({
    users,
    loading,
    error,
    selectedClientId,
    setSelectedClientId
}: ClientSectionProps) => {


    const handleCheckboxChange = (clientId: string) => {
        setSelectedClientId(prev =>
            prev === clientId ? null : clientId
        );
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        setSelectedClientId(value === "" ? null : value);
    };

    return (
        <div className="flex flex-col h-full p-3">

            <div className="hidden sm:block mb-4">
                <Input placeholder="Search clients" fullWidth />
            </div>

            {error ? (
                <p className="bg-yellow-100 text-red-600 px-3 py-1 rounded-md">
                    {error}
                </p>
            ) : (
                <div className="hidden sm:flex flex-col overflow-y-auto flex-1">
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <CircularProgress enableTrackSlot size={15} />
                            <p>Loading clients...</p>
                        </span>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {users.map((client) => (
                                <FormGroup
                                    key={client._id}
                                    className="w-full border-b border-gray-200 hover:bg-gray-100 rounded-md transition-all cursor-pointer px-2"
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={selectedClientId === client._id}
                                                onChange={() =>
                                                    handleCheckboxChange(client._id)
                                                }
                                            />
                                        }
                                        label={client.name}
                                    />
                                </FormGroup>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="sm:hidden mt-3">
                <Select
                    value={selectedClientId ?? ""}
                    onChange={handleSelectChange}
                    displayEmpty
                    fullWidth
                    size="small"
                >
                    <MenuItem value="">
                        <em>Select a client</em>
                    </MenuItem>

                    {users.map((client) => (
                        <MenuItem key={client._id} value={client._id}>
                            {client.name}
                        </MenuItem>
                    ))}
                </Select>
            </div>
        </div>
    );
};

export default ClientsSection;