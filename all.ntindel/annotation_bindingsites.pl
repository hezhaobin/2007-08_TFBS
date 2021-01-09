###################################
#!/usr/bin/perl -w
#  Created Aug 6th 2007
#  For annotating the binding 
#  sites in the poly/div data
#  Hebin
###################################


use DBI;
prepareDbh();

while




sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}
