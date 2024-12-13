interface WelcomeHeaderProps {
    title: string;
    description: string;
}

const WelcomeHeader = ({ title, description }: WelcomeHeaderProps) => (
    <div className="text-center mb-8">
        <img src="/logo.svg" alt="Logo" className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-600 mt-2">{description}</p>
    </div>
);

export default WelcomeHeader; 