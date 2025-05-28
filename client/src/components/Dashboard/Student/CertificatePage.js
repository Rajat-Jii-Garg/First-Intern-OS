// client/src/components/Dashboard/Student/CertificatePage.js
import React, { useState, useEffect } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import userService from '../../../services/user.service'; // To get user name and dashboard data
import Spinner from '../../Common/Spinner';
import Alert from '../../Common/Alert';
import { FaCertificate, FaDownload } from 'react-icons/fa';
import './StudentDashboard.css'; // Shared CSS
// Optional: Register a nice font for PDF
// import PoppinsRegular from '../../../assets/fonts/Poppins-Regular.ttf'; // Make sure you have the font file
// import PoppinsBold from '../../../assets/fonts/Poppins-Bold.ttf';
// Font.register({ family: 'Poppins', fonts: [{ src: PoppinsRegular }, { src: PoppinsBold, fontWeight: 'bold' }] });
// Optional: Add a logo
// import CompanyLogo from '../../../assets/logo.png'; // Path to your logo

const pdfStyles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica', // Using default font if Poppins not registered
        // fontFamily: 'Poppins', // Use if Poppins is registered
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        border: '10px solid #007BFF',
    },
    header: { textAlign: 'center', marginBottom: 30, borderBottomWidth: 2, borderBottomColor: '#007BFF', paddingBottom: 15 },
    // logo: { width: 80, height: 80, alignSelf: 'center', marginBottom: 10 },
    mainTitle: { fontSize: 28, fontWeight: 'bold', color: '#0056b3', marginBottom: 5 },
    programTitle: { fontSize: 16, color: '#333333', marginBottom: 25, fontStyle: 'italic' },
    body: { fontSize: 12, textAlign: 'center', marginBottom: 20, lineHeight: 1.6 },
    presentedTo: { fontSize: 14, marginBottom: 5, color: '#555' },
    recipientName: { fontSize: 24, fontWeight: 'bold', color: '#007BFF', marginVertical: 10, textTransform: 'capitalize' },
    completionText: { fontSize: 12, marginBottom: 20, paddingHorizontal: 30 },
    projectSection: { marginTop: 20, marginBottom: 30, textAlign: 'left', borderTopWidth:1, borderTopColor: '#eee', paddingTop: 15 },
    projectSectionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 8, color: '#0056b3' },
    projectItem: { fontSize: 11, marginLeft: 15, marginBottom: 4, color: '#444' },
    footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 9, color: '#6c757d' },
    signatureSection: { marginTop: 40, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' },
    signatureLine: { borderTop: '1px solid #333333', width: 180, textAlign: 'center', paddingTop: 5, fontSize: 10, color: '#333' },
    dateText: { fontSize: 10, color: '#333', marginTop: 5},
});

const CertificateDocument = ({ studentName, approvedProjects }) => (
    <Document title={`Certificate - ${studentName}`}>
        <Page size="A4" style={pdfStyles.page} orientation="landscape">
            <View style={pdfStyles.header}>
                {/* {CompanyLogo && <Image style={pdfStyles.logo} src={CompanyLogo} />} */}
                <Text style={pdfStyles.mainTitle}>Certificate of Completion</Text>
                <Text style={pdfStyles.programTitle}>First Intern OS - Internship Program</Text>
            </View>
            <View style={pdfStyles.body}>
                <Text style={pdfStyles.presentedTo}>This certificate is proudly presented to</Text>
                <Text style={pdfStyles.recipientName}>{studentName || 'Valued Intern'}</Text>
                <Text style={pdfStyles.completionText}>
                    in recognition of the successful completion of all required projects
                    for the First Intern OS Internship Program. This demonstrates commendable
                    skill, dedication, and a proactive approach to learning and project execution.
                </Text>
            </View>
            {approvedProjects && approvedProjects.length > 0 && (
                <View style={pdfStyles.projectSection}>
                    <Text style={pdfStyles.projectSectionTitle}>Successfully Completed Projects:</Text>
                    {approvedProjects.map((proj, index) => (
                        <Text key={index} style={pdfStyles.projectItem}>
                            - {proj.title} (Original: {proj.projectTitleSnapshot || proj.title})
                        </Text>
                    ))}
                </View>
            )}
            <View style={pdfStyles.signatureSection}>
                <View>
                    <Text style={pdfStyles.signatureLine}>Program Coordinator</Text>
                    <Text style={pdfStyles.dateText}>First Intern OS</Text>
                </View>
                <View>
                    <Text style={pdfStyles.signatureLine}>Date of Issue</Text>
                    <Text style={pdfStyles.dateText}>{new Date().toLocaleDateString('en-GB')}</Text>
                </View>
            </View>
            <View style={pdfStyles.footer}>
                <Text>This certificate is digitally generated by First Intern OS.</Text>
            </View>
        </Page>
    </Document>
);


const CertificatePage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const response = await userService.getStudentDashboardData();
                setDashboardData(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load data for certificate.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <Spinner message="Loading certificate status..." />;
    if (error) return <Alert type="danger" message={error} />;
    if (!dashboardData) return <Alert type="info" message="Could not load certificate information."/>;

    const { user, certificateUnlocked, projects } = dashboardData;
    const approvedProjectsForPDF = projects.filter(p => p.status === 'Approved').map(p => p.submissionDetails || {title: p.title, projectTitleSnapshot: p.title});


    return (
        <div className="certificate-page card">
            <h2 className="page-title"><FaCertificate /> Internship Certificate</h2>
            {certificateUnlocked ? (
                <>
                    <Alert type="success" message={`Congratulations, ${user?.name}! You have successfully completed all projects.`} />
                    <p className="mb-3">
                        You have earned your Internship Completion Certificate. Download it below.
                    </p>
                    <PDFDownloadLink
                        document={<CertificateDocument studentName={user?.name} approvedProjects={approvedProjectsForPDF} />}
                        fileName={`FirstInternOS_Certificate_${user?.name?.replace(/\s+/g, '_') || 'Intern'}.pdf`}
                        className="btn btn-primary btn-lg"
                    >
                        {({ blob, url, loading: pdfLoading, error: pdfError }) =>
                            pdfLoading ? (
                                <Spinner message="" />
                            ) : (
                                <><FaDownload /> Download Certificate (PDF)</>
                            )
                        }
                    </PDFDownloadLink>
                    {/* Optional: Certificate Preview Area (could be an iframe or image of the PDF) */}
                </>
            ) : (
                <>
                    <Alert type="warning" message="Your certificate is not yet unlocked." />
                    <p>
                        Please ensure all {dashboardData.totalProjects || 3} internship projects are submitted and marked as 'Approved' by an admin.
                        You currently have <strong>{dashboardData.approvedCount || 0}</strong> approved project(s).
                    </p>
                    <p className="mt-2">Keep up the great work!</p>
                </>
            )}
        </div>
    );
};

export default CertificatePage;