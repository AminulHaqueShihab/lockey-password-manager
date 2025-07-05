// Service configuration with brand colors and icons
export interface ServiceConfig {
	name: string;
	color: string;
	gradient: string;
	icon: string;
	url: string;
}

// Predefined service configurations
export const serviceConfigs: Record<string, ServiceConfig> = {
	discord: {
		name: 'Discord',
		color: '#5865F2',
		gradient: 'from-[#5865F2] to-[#4752C4]',
		icon: '💬',
		url: 'https://discord.com',
	},
	airbnb: {
		name: 'Airbnb',
		color: '#FF5A5F',
		gradient: 'from-[#FF5A5F] to-[#E31C5F]',
		icon: '🏠',
		url: 'https://airbnb.com',
	},
	github: {
		name: 'GitHub',
		color: '#24292E',
		gradient: 'from-[#24292E] to-[#2F363D]',
		icon: '🐙',
		url: 'https://github.com',
	},
	google: {
		name: 'Google',
		color: '#4285F4',
		gradient: 'from-[#4285F4] to-[#34A853]',
		icon: '🔍',
		url: 'https://google.com',
	},
	facebook: {
		name: 'Facebook',
		color: '#1877F2',
		gradient: 'from-[#1877F2] to-[#166FE5]',
		icon: '📘',
		url: 'https://facebook.com',
	},
	twitter: {
		name: 'Twitter',
		color: '#1DA1F2',
		gradient: 'from-[#1DA1F2] to-[#0D8BD9]',
		icon: '🐦',
		url: 'https://twitter.com',
	},
	instagram: {
		name: 'Instagram',
		color: '#E4405F',
		gradient: 'from-[#E4405F] to-[#C13584]',
		icon: '📷',
		url: 'https://instagram.com',
	},
	linkedin: {
		name: 'LinkedIn',
		color: '#0A66C2',
		gradient: 'from-[#0A66C2] to-[#0077B5]',
		icon: '💼',
		url: 'https://linkedin.com',
	},
	netflix: {
		name: 'Netflix',
		color: '#E50914',
		gradient: 'from-[#E50914] to-[#B20710]',
		icon: '🎬',
		url: 'https://netflix.com',
	},
	spotify: {
		name: 'Spotify',
		color: '#1DB954',
		gradient: 'from-[#1DB954] to-[#1ED760]',
		icon: '🎵',
		url: 'https://spotify.com',
	},
	amazon: {
		name: 'Amazon',
		color: '#FF9900',
		gradient: 'from-[#FF9900] to-[#F90]',
		icon: '📦',
		url: 'https://amazon.com',
	},
	microsoft: {
		name: 'Microsoft',
		color: '#0078D4',
		gradient: 'from-[#0078D4] to-[#106EBE]',
		icon: '🪟',
		url: 'https://microsoft.com',
	},
	apple: {
		name: 'Apple',
		color: '#000000',
		gradient: 'from-[#000000] to-[#333333]',
		icon: '🍎',
		url: 'https://apple.com',
	},
};

/**
 * Gets service configuration by service name
 * @param serviceName - The name of the service
 * @returns Service configuration or default fallback
 */
export function getServiceConfig(serviceName: string): ServiceConfig {
	const normalizedName = serviceName.toLowerCase().replace(/\s+/g, '');

	// Try to find exact match
	if (serviceConfigs[normalizedName]) {
		return serviceConfigs[normalizedName];
	}

	// Try to find partial match
	for (const [key, config] of Object.entries(serviceConfigs)) {
		if (normalizedName.includes(key) || key.includes(normalizedName)) {
			return config;
		}
	}

	// Return default configuration
	return {
		name: serviceName,
		color: '#6B7280',
		gradient: 'from-[#6B7280] to-[#4B5563]',
		icon: '🔐',
		url: '',
	};
}

/**
 * Gets a random service configuration for demo purposes
 * @returns Random service configuration
 */
export function getRandomServiceConfig(): ServiceConfig {
	const services = Object.values(serviceConfigs);
	return services[Math.floor(Math.random() * services.length)];
}

/**
 * Gets all available categories
 * @returns Array of category names
 */
export function getCategories(): string[] {
	return [
		'General',
		'Social Media',
		'Work',
		'Finance',
		'Shopping',
		'Entertainment',
		'Gaming',
		'Education',
		'Health',
		'Travel',
	];
}

/**
 * Gets category color
 * @param category - The category name
 * @returns Color string
 */
export function getCategoryColor(category: string): string {
	const colors: Record<string, string> = {
		General: '#6B7280',
		'Social Media': '#3B82F6',
		Work: '#10B981',
		Finance: '#F59E0B',
		Shopping: '#EF4444',
		Entertainment: '#8B5CF6',
		Gaming: '#EC4899',
		Education: '#06B6D4',
		Health: '#84CC16',
		Travel: '#F97316',
	};

	return colors[category] || '#6B7280';
}
