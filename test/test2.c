#include <stdio.h>
#include <string.h>

// Define the missing structure here

int main(void)
{
    struct Ship vessel_1 = { "Tanker", 100000, { NULL } };

    memset(vessel_1.cargo, 0, sizeof(vessel_1.cargo));
    vessel_1.cargo[0] = "Gasoline";
    vessel_1.cargo[1] = "Oil";

    struct Ship vessel_2;
    memset(vessel_2.cargo, 0, sizeof(vessel_2.cargo));
    vessel_2.name = "Fun boat";
    vessel_2.weight = 1.25;
    vessel_2.cargo[0] = "Food basket";
    vessel_2.cargo[1] = "Sunscreen";
    vessel_2.cargo[2] = "Very good lemonade";

    struct Ship ships[2];
    ships[0] = vessel_1;
    ships[1] = vessel_2;

    for (int i = 0; i < 2; i++) {
	    printf("Name: %s  / Weight %.2f tonnes\n", ships[i].name, ships[i].weight);
	    printf("Cargo:\n");
	    for (int j = 0; ships[i].cargo[j] != NULL; j++) {
	        printf("* %s\n", ships[i].cargo[j]);
	    }
	    printf("----------\n");
    }

    return 0;
}

