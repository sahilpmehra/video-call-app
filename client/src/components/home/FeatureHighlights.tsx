import { VideoIcon, SecurityIcon, NoSignupIcon } from '../icons/FeatureIcons';

const FeatureHighlights = () => (
    <div className="grid grid-cols-3 gap-4 mb-8">
        <FeatureItem
            icon={<VideoIcon />}
            text="HD Video"
        />
        <FeatureItem
            icon={<SecurityIcon />}
            text="Secure"
        />
        <FeatureItem
            icon={<NoSignupIcon />}
            text="No Sign Up"
        />
    </div>
);

const FeatureItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
    <div className="text-center p-4">
        <div className="h-8 w-8 mx-auto text-blue-500 mb-2">
            {icon}
        </div>
        <p className="text-sm text-gray-600">{text}</p>
    </div>
);

export default FeatureHighlights; 