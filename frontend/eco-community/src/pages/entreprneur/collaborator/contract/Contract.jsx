import {useEffect, useState} from 'react';
import { Download, Eye, X } from 'lucide-react';
import api from "../../../../Services/api.js";
import {Card} from "../../../../components/ui/card.jsx";


const ContractViewer = ({ contract, onClose }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        const loadPdf = async () => {
            try {
                const response = await api.get(`/contracts/${contract.id}/view/`, {
                    responseType: 'blob'
                });
                const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                setPdfUrl(url);
                setIsLoading(false);
            } catch (err) {
                console.error('Error loading PDF:', err);
                setError('Failed to load PDF');
                setIsLoading(false);
            }
        };

        loadPdf();

        // Cleanup function to revoke the blob URL
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [contract.id]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                        {contract.proposal_details?.project_name || 'Contract'} - {contract.contract_type}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="flex-1 p-4 overflow-hidden">
                    {isLoading && (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                        </div>
                    )}
                    {error && (
                        <div className="flex justify-center items-center h-full text-red-500">
                            {error}
                        </div>
                    )}
                    {pdfUrl && !isLoading && !error && (
                        <embed
                            src={pdfUrl}
                            type="application/pdf"
                            className="w-full h-full"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const ContractCard = ({ contract }) => {
    const [showViewer, setShowViewer] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            const response = await api.get(`/contracts/${contract.id}/download/`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${contract.proposal_details?.project_name || 'contract'}_${contract.contract_type}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading contract:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Card className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    {contract.proposal_details?.project_name || 'Contract'}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    contract.contract_type === 'financial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                }`}>
          {contract.contract_type}
        </span>
            </div>
            <div className="flex flex-col gap-2">
                <div className="text-gray-600">
                    Investor: {contract.proposal_details?.investor_name || 'Not specified'}
                </div>
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => setShowViewer(true)}
                        className="flex items-center text-blue-600 hover:text-blue-800 px-3 py-1 rounded-lg hover:bg-blue-50"
                    >
                        <Eye className="h-5 w-5 mr-2" />
                        View
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex items-center text-emerald-600 hover:text-emerald-800 px-3 py-1 rounded-lg hover:bg-emerald-50"
                    >
                        <Download className="h-5 w-5 mr-2" />
                        {isDownloading ? 'Downloading...' : 'Download'}
                    </button>
                </div>
            </div>
            {showViewer && (
                <ContractViewer
                    contract={contract}
                    onClose={() => setShowViewer(false)}
                />
            )}
        </Card>
    );
};

export default ContractCard;