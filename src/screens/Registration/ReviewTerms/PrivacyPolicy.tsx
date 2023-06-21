import RegistrationParams from "../Interfaces/RegistrationParams";
import styles from "./ReviewTermsAndPolicy.module.css"
import { Container } from "react-bootstrap";

interface Props {
    title: string;
    termsParams: RegistrationParams["m.login.terms"];
}

const PrivacyPolicy = ({ title, termsParams }: Props) => {
    return (
        <Container className={styles.policyDisplay}>

            {title === termsParams.policies[0].name + " " + termsParams.policies[0].version && (
                <a href={termsParams.policies[0].en.url}>Click Here to Review Privacy Policy</a>
            )

                /*<div className="container">
                    <h2 className="fw-bold mb-3">The Service</h2>
                    <p className="lead fw-normal text-muted mb-4">This document lets you know exactly what information we collect from you, what data we can observe as you use the service, and how we use that information.</p><p className="lead fw-normal text-normal mb-4">Circuli is an online service based on Matrix and focused on social networking. It is accessible online at the circu.li domain and various subdomains, and accessed through the Circles app or another Matrix client. The service is provided by FUTO Holdings Inc. (“FUTO”). This Statement of Privacy applies to use of the Circles app as well as via other clients, and this statement governs data collection and usage. By using the Circu.li service (the “Service”), either on the web or through an app, you consent to the data practices described in this statement.</p>
                    <h2 className="fw-bold mb-3">What Data Do We Collect, And How Do We Collect It?</h2>
                    <p className="lead fw-normal text-normal mb-4">In order to provide you with products and services offered, FUTO may collect personally identifiable information, such as your:</p>
                    <ul className="lead fw-normal text-normal mb-4">
                        <li>First and Last Name</li>
                        <li>E-mail Address</li>
                        <li>Phone Number</li>
                        <li>Profile Picture</li>
                        <li>Credit Card or other payment information</li>
                        <li>Circu.li Matrix username</li>
                    </ul>
                    <p className="lead fw-normal text-normal mb-4">As a result of your using the app, we may also collect the following information from your device:</p>
                    <ul className="lead fw-normal text-normal mb-4">
                        <li>A random identifier for your device, unique to the Circu.li network</li>
                        <li>The make and model of your device, e.g.&nbsp;“iPhone XR”</li>
                        <li>The version of your device’s operating system, e.g.&nbsp;“iOS 14.4”</li>
                        <li>The version of our application(s) that you are using, e.g.&nbsp;“Circles (iOS) v1.0.1”</li>
                    </ul>
                    <p className="lead fw-normal text-normal mb-4">When you use the service to communicate with other users, the app’s built-in end-to-end encryption prevents us from reading the contents of your messages. However, we can observe the following “metadata” about the way you communicate on the service:</p>
                    <ul className="lead fw-normal text-normal mb-4">
                        <li>When you log on to the service and how long you stay connected</li>
                        <li>Your device’s most recent network address</li>
                        <li>The day and time when your device last connected to the service</li>
                        <li>Your social connections to other users on the service; We see when you make a new connection or break an old one</li>
                        <li>The level of access and administrative power given to each user in your circles and groups. Is the user allowed to post messages, or only to read what others post? Is the user a moderator or an administrator, capable of inviting new users and removing existing users from the group?</li>
                        <li>The time and size in bytes of any encrypted messages that you post</li>
                        <li>The time and approximate file size of any encrypted attachments (photos, videos, etc) that you post</li>
                    </ul>
                    <h2 className="fw-bold mb-3">What Data Do We Not Collect?</h2>
                    <p className="lead fw-normal text-normal mb-4">FUTO does not intentionally collect sensitive personal information, such as social security numbers, genetic data, health information, or religious information. We do not need or want to know your race, sex, age (as long as you’re over 18), gender, religion, income, medical history, or most other private and personal aspects of your life. As long as you’re a real human being of sufficient age to use the service, we are happy to have you on board.</p>
                    <p className="lead fw-normal text-normal mb-4">FUTO does not knowingly collect personally identifiable information from children under the age of eighteen. If you are under the age of eighteen, you may not create an account. If we learn or have reason to suspect that a user is under the age of 18, we will close the child’s account.</p>
                    <p className="lead fw-normal text-normal mb-4">Although FUTO does not request or intentionally collect any sensitive personal information, we realize that users might share this kind of information in an encrypted message on the service. In such cases, the service’s built-in end-to-end encryption would prevent FUTO from accessing the message contents. FUTO cannot collect any information from the contents of an encrypted message or an encrypted attachment, unless an authorized recipient of the message first reports the message to us as inappropriate and provides us with the corresponding decryption key(s).</p>
                    <p className="lead fw-normal text-normal mb-4">FUTO does not collect any information on your use of other web sites or other apps besides those provided by FUTO. Unlike other social platforms, we never use third-party cookies or web trackers that follow you around the web. That would be creepy.</p>
                    <h2 className="fw-bold mb-3">How Will We Use Your Data?</h2>
                    <p className="lead fw-normal text-normal mb-4">FUTO collects and uses your personal information solely to operate and deliver the services that you have requested. We may use your personal information as follows.</p>
                    <p className="lead fw-normal text-normal mb-4">To communicate with you:</p>
                    <ul className="lead fw-normal text-normal mb-4">
                        <li>To notify you about important changes to the service, including updates to this privacy policy or other policies, or important security updates</li>
                        <li>To notify you about suspicious activity on your account</li>
                        <li>To help you reset your account password</li>
                    </ul>
                    <p className="lead fw-normal text-normal mb-4">To deliver the service to you:</p>
                    <ul className="lead fw-normal text-normal mb-4">
                        <li>To deliver the messages that you send and receive through the service.</li>
                        <li>To help you connect with other users. Any user who knows your Circuli username can look up your public (“display”) name and your public profile photo. These will be automatically displayed along with each message that you post.</li>
                        <li>To (optionally) enable your friends to look up your Circuli username from your email address or telephone number. This only applies if you have voluntarily provided this information to us for this specific purpose. Also note that this lookup is strictly one-way. Other users cannot look up your email address or phone number from your Circuli username.</li>
                        <li>To enable you to log in using your email address instead of your Circuli username, or to allow you to log in before you have configured your Circuli username.</li>
                    </ul>
                    <p className="lead fw-normal text-normal mb-4">To operate the service:</p>
                    <ul className="lead fw-normal text-normal mb-4">
                        <li>To detect malicious, illegal, or fraudulent use of the service; and to prosecute such misuse.</li>
                        <li>To maintain, operate, analyze, plan, and grow our infrastructure to keep up with demand.</li>
                        <li>To respond to reports of abusive, illegal, or otherwise inappropriate content.</li>
                        <li>To understand how users experience the service. What features do users benefit from? What works well, and what doesn’t?</li>
                    </ul>
                    <h2 className="fw-bold mb-3">Sharing Information with Third Parties</h2>
                    <p className="lead fw-normal text-normal mb-4">FUTO does not sell, trade, rent or lease its customer lists to any third parties. Not ever.</p>
                    <p className="lead fw-normal text-normal mb-4">FUTO may share data with trusted partners to help deliver the service, for example to send you email or text messages. All such third parties are prohibited from using your personal information except to provide these services to FUTO, and they are required to maintain the confidentiality of your information.</p>
                    <p className="lead fw-normal text-normal mb-4">Under extreme circumstances, FUTO may disclose your personal information, without notice, if required to do so by law or in the good faith belief that such action is necessary to: (a) conform to the edicts of the law or comply with legal process served on FUTO or the site; (b) protect and defend the rights or property of FUTO; and/or (c) act under exigent circumstances to protect the personal safety of users of Circuli, or the public.</p>
                    <h2 className="fw-bold mb-3">Right to Deletion</h2>
                    <p className="lead fw-normal text-normal mb-4">Subject to certain exceptions set out below, on receipt of a verifiable request from you, we will:</p>
                    <ul className="lead fw-normal text-normal mb-4">
                        <li>Delete your personal information from our records; and</li>
                        <li>Direct any service providers to delete your personal information from their records.</li>
                    </ul>
                    <p className="lead fw-normal text-normal mb-4">Please note that we may not be able to comply with requests to delete your personal information if it is necessary to:</p>
                    <ul className="lead fw-normal text-normal mb-4">
                        <li>Complete the transaction for which the personal information was collected, fulfill the terms of a written warranty or product recall conducted in accordance with federal law, provide a good or service requested by you, or reasonably anticipated within the context of our ongoing business relationship with you, or otherwise perform a contract between you and us;</li>
                        <li>Detect security incidents, protect against malicious, deceptive, fraudulent, or illegal activity; or prosecute those responsible for that activity;</li>
                        <li>Debug to identify and repair errors that impair existing intended functionality;</li>
                        <li>Exercise free speech, ensure the right of another consumer to exercise his or her right of free speech, or exercise another right provided for by law;</li>
                        <li>Comply with the California Electronic Communications Privacy Act;</li>
                        <li>Engage in public or peer-reviewed scientific, historical, or statistical research in the public interest that adheres to all other applicable ethics and privacy laws, when our deletion of the information is likely to render impossible or seriously impair the achievement of such research, provided we have obtained your informed consent;</li>
                        <li>Enable solely internal uses that are reasonably aligned with your expectations based on your relationship with us;</li>
                        <li>Comply with an existing legal obligation; or</li>
                        <li>Otherwise use your personal information, internally, in a lawful manner that is compatible with the context in which you provided the information.</li>
                    </ul>
                    <h2 className="fw-bold mb-3">Changes to this Statement</h2>
                    <p className="lead fw-normal text-normal mb-4">FUTO reserves the right to change this Privacy Policy from time to time. We will notify you about significant changes in the way we treat personal information by sending a notice to the primary email address specified in your account, by placing a prominent notice on our application, and/or by updating any privacy information. Your continued use of the application and/or Services available after such modifications will constitute your: (a) acknowledgment of the modified Privacy Policy; and (b) agreement to abide and be bound by that Policy.</p>
                    <h2 className="fw-bold mb-3">Contact Information</h2>
                    <p className="lead fw-normal text-normal mb-4">FUTO welcomes your questions or comments regarding this Statement of Privacy. If you believe that FUTO has not adhered to this Statement, please contact us at:</p>
                    <p className="lead fw-normal text-normal mb-4">FUTO Holdings Inc</p>
                    <p className="lead fw-normal text-normal mb-4">1806 Rio Grande St</p>
                    <p className="lead fw-normal text-normal mb-4">Austin, Texas 78701 USA</p>
                    <p className="lead fw-normal text-normal mb-4">legal@futo.org</p>
                    
                    <p className="lead fw-normal text-normal mb-4">Version 1.1</p>
                    <p className="lead fw-normal text-normal mb-4">Effective as of Nov 7, 2022</p>
                </div>
            )*/}
        </Container>
    );
}
export default PrivacyPolicy;
